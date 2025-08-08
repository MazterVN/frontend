import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import type {
  ClickEventArgs,
} from '@syncfusion/ej2-navigations'
import { v4 as uuidv4 } from 'uuid'
import {
  AttachmentNamespace,
  AttendanceType,
  type BatchUpdateRelatedStudentAttendanceInput,
  type GetTimetableAsTableQuery,
  type ReadStudentAttendanceWithGenerateQuery,
  type StudentAttendanceInput,
  type UpdateRelatedStudentAttendanceInput,
} from '#gql/default'
import { BaseFilemanager } from '#components'

// Types
type Attendance = At<ReadStudentAttendanceWithGenerateQuery, 'readStudentAttendanceWithGenerate'>
type AttendanceAttachment = At<Attendance, 'attachments'>
type GetTimetable = At<GetTimetableAsTableQuery, 'getTimetableAsTable'>
type Timetable = At<GetTimetable, 'times.days'>
interface TimetableParam extends At<GetTimetable, 'times.days'> {
  studyYearId: string
  startDate: string
  endDate: string
  studentServiceIds: string[]
  isAbsent: boolean
  type: AttendanceType
  lateTime: number
  note: string
  attachments: AttendanceAttachment[]
}
type TimetableTime = At<GetTimetable, 'times'>

export const useAttendanceMultipleStore = defineStore('attendanceMultipleStore', () => {
  const dayjs = useDayjs()
  const { start, finish } = useLoadingIndicator()
  // State
  let grid: Grid | null = null
  const item = ref<GetTimetable>(initItem())
  const attendances = ref<Attendance[]>([])
  const itemParam = ref<TimetableParam>(initItemParam())
  const selectedTimetableIds = ref<Set<string>>(new Set())
  const weekdays = computed(() => getIsoWeekdays(itemParam.value.startDate, itemParam.value.endDate))
  const isLoading = ref(false)
  const modal = useModalStore()
  const { user } = useAuthentication()
  // Watchers
  watch(() => [itemParam.value.serviceDetailId, itemParam.value.subjectGroupingId],
    ([serviceDetailId, subjectGroupingId]) => {
      if (!serviceDetailId || !subjectGroupingId) {
        resetItem()
        return
      }
      getAsTable()
    },
    { immediate: true, deep: true },
  )
  // watch date and timetable ids
  watch(
    () => [itemParam.value.startDate, itemParam.value.endDate, itemParam.value.studentServiceIds, selectedTimetableIds.value] as const,
    async ([startDate, endDate, studentServiceIds, timetableIds]: readonly [string, string, string[], Set<string>]) => {
      if (!startDate || !endDate || !studentServiceIds.length || !timetableIds.size) {
        return
      }
      await fetchAttendance()
    },
    { deep: true },
  )

  // Initialization helpers
  function initItem(): GetTimetable {
    return {
      id: uuidv4(),
      subjectGroupingId: '',
      serviceDetailId: '',
      headers: [],
      times: [],
    }
  }
  function initAttachment(): AttendanceAttachment {
    return {
      id: uuidv4(),
      bucket: '',
      key: '',
    }
  }
  function attachFile(id: string) {
    // Find index of attachment to update
    const index = itemParam.value.attachments.findIndex(a => a.id === id)
    if (index === -1) return

    // Open file manager modal
    modal.open(BaseFilemanager, {
      fullscreen: false,
      namespace: AttachmentNamespace.ALL,
      picker: true,
      key: 'imagePickerKey',
      bucket: user.bucket ?? '',
      bucketFolder: user.bucketFolder ?? '',
      allowedExtensions: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
      ui: {
        width: 'w-full sm:max-w-6xl',
      },

      onChoose: (files: FileMetadata[]) => {
        // Directly update the attachment in the array
        itemParam.value.attachments[index] = {
          ...itemParam.value.attachments[index] as AttendanceAttachment,
          bucket: files[0]?.bucket ?? '',
          key: files[0]?.key ?? '',
        }
      },
    })
  }
  function initItemParam(): TimetableParam {
    return {
      id: uuidv4(),
      studyYearId: '',
      startDate: '',
      endDate: '',
      studentServiceIds: [],
      subjectGroupingId: '',
      subjectGroupingDetailId: '',
      daysOfWeekId: '',
      serviceDetailId: '',
      isAbsent: false,
      type: AttendanceType.PRESENT,
      lateTime: 0,
      note: '',
      attachments: [],
    }
  }
  function addAttachment() {
    itemParam.value.attachments.push(initAttachment())
  }
  function removeAttachment(id: string) {
    itemParam.value.attachments = itemParam.value.attachments.filter(attachment => attachment.id !== id)
  }
  function resetItem() {
    item.value = initItem()
    attendances.value = []
  }

  // Grid-related methods
  const attendanceGridConfig = (): GridModel => ({
    ...globalGridConfig,
    allowPaging: false,
    dataSource: attendances.value,
    contextMenuItems: toContextMenuItems([
      {
        id: 'edit',
        text: 'Edit',
        iconCss: 'e-menu-icon e-icons e-edit',
      },
      'AutoFit',
      'AutoFitAll',
      'SortAscending',
      'SortDescending',
      'FirstPage',
      'PrevPage',
      'LastPage',
      'NextPage',
    ]),
    toolbarClick: handleToolbarClick,
    rowSelected: handleRowSelect,
    rowDeselected: handleRowDeselect,
    allowGrouping: true,
    groupSettings: { showDropArea: false, columns: ['student.name', 'timetable.timeRange'] },
    toolbar: [
      'Search',
    ],
  })
  function setGridRef(instance: Grid | null): void {
    grid = instance
  }

  function initToolbar() {
    grid?.toolbarModule.enableItems(['edit'], false)
    grid?.contextMenuModule.contextMenu.enableItems(['Edit'], false)
  }

  function handleToolbarClick(args: ClickEventArgs): void {
    const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
    switch (toolbarId) {
      case 'delete':
        console.log('Performing delete operation')
        // Perform delete operation logic here
        break

      default:
        console.log('Unknown operation')
        // Handle unknown operation
        break
    }
  }

  function handleRowSelect(_args: RowSelectEventArgs): void {
    const selectedRecords = grid?.getSelectedRecords()
    grid?.toolbarModule.enableItems(
      ['edit'],
      selectedRecords?.length === 1,
    )
    grid?.contextMenuModule.contextMenu.enableItems(
      ['Edit'],
      selectedRecords?.length === 1,
    )
  }

  function handleRowDeselect(_args: RowDeselectEventArgs): void {
    const selectedRecords = grid?.getSelectedRecords()
    grid?.toolbarModule.enableItems(
      ['edit'],
      selectedRecords?.length === 1,
    )
    grid?.contextMenuModule.contextMenu.enableItems(
      ['Edit'],
      selectedRecords?.length === 1,
    )
  }

  // Timetable operations
  async function getAsTable() {
    const tmpSubjectGroupingId = itemParam.value.subjectGroupingId || uuidv4()
    const tmpServiceDetailId = itemParam.value.serviceDetailId || uuidv4()
    const data = await timetableRepository.getAsTable(tmpSubjectGroupingId, tmpServiceDetailId)
    if (data.getTimetableAsTable) {
      item.value = data.getTimetableAsTable
    }
  }

  function removeTime(id: string) {
    item.value.times = item.value.times.filter(time => time.id !== id)
  }

  function updateTime(time: TimetableTime, event: [string, string] | null) {
    if (!event) {
      time.startTime = '00:00:00'
      time.endTime = '00:00:00'
      return
    }
    time.startTime = event[0]
    time.endTime = event[1]
  }

  function toggleTimetable(day: Timetable) {
    // Return early if day is not valid for selection
    if (!isValidDayForSelection(day)) {
      return
    }

    // Toggle selection state
    const isSelected = selectedTimetableIds.value.has(day.id)
    if (isSelected) {
      selectedTimetableIds.value.delete(day.id)
    }
    else {
      selectedTimetableIds.value.add(day.id)
    }
  }

  function isValidDayForSelection(day: Timetable): boolean {
    return weekdays.value.includes(day.daysOfWeekSortOrder ?? 0)
      && !!day.subjectGroupingDetailId
  }

  function setSelectedTimetableIds() {
    const timetableIds = item.value.times
      .flatMap(time => time.days)
      .filter(day => weekdays.value.includes(day.daysOfWeekSortOrder ?? 0) && day.subjectGroupingDetailId)
      .map(day => day.id)
    selectedTimetableIds.value = new Set(timetableIds)
  }

  // Attendance operations
  async function fetchAttendance() {
    const result = await attendanceRepository.readStudentAttendanceWithGenerate(
      itemParam.value.startDate,
      itemParam.value.endDate,
      Array.from(selectedTimetableIds.value),
      itemParam.value.studentServiceIds,
    )
    attendances.value = result?.readStudentAttendanceWithGenerate ?? []
  }

  function toUpdateAttendanceInput(item: Attendance): UpdateRelatedStudentAttendanceInput {
    return {
      id: item.id,
      datetime: item.datetime,
      isAbsent: item.isAbsent,
      lateTime: item.lateTime,
      attachments: item.attachments?.filter(a => Boolean(a.bucket)) ?? [],
      note: item.note,
      studentServiceId: item.studentServiceId,
      timetableId: item.timetableId,
      type: item.type,
      draftAt: item.draftAt,
      checked: item.checked,
    }
  }

  function toStudentAttendanceInput(attendance: Attendance): StudentAttendanceInput {
    return {
      id: attendance.id ?? '',
      isAbsent: attendance.isAbsent ?? false,
      lateTime: attendance.lateTime ?? 0,
      note: attendance.note ?? '',
      studentServiceId: attendance.studentServiceId ?? '',
      timetableId: attendance.timetableId ?? '',
      type: attendance.type ?? AttendanceType.PRESENT,
      attachments: attendance.attachments?.filter(a => Boolean(a.bucket)) ?? [],
      checked: attendance.checked ?? false,
      datetime: attendance.datetime ?? dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]'),
      draftAt: attendance.draftAt ?? null,
    }
  }
  function toBatchUpdateAttendanceInput(attendances: Attendance[]): BatchUpdateRelatedStudentAttendanceInput {
    return {
      studentAttendances: attendances.map(toStudentAttendanceInput),
    }
  }

  async function updateAttendance(attendance: Attendance) {
    const input = toUpdateAttendanceInput(attendance)
    const result = await attendanceRepository.update(input.id ?? '', input)
    if (result && !result.updateRelatedStudentAttendance.errors.length) {
      showSuccessToast('បានរក្សាទុកជោគជ័យ')
    }
  }

  async function batchUpdateAttendance() {
    start()
    const input = toBatchUpdateAttendanceInput(attendances.value)
    const result = await attendanceRepository.batchUpdate(input)
    if (result) {
      showSuccessToast('បានរក្សាទុកជោគជ័យ')
    }
    finish()
  }

  async function batchApplyChanged() {
    const attendanceParams = itemParam.value
    const items = grid?.getCurrentViewRecords() as Attendance[]
    items.forEach((attendance) => {
      attendance.isAbsent = attendanceParams.isAbsent
      attendance.type = attendanceParams.type
      attendance.lateTime = attendanceParams.lateTime
      attendance.note = attendanceParams.note
      attendance.attachments = attendanceParams.attachments
    })
    attendances.value = items
    grid?.refresh()
    await batchUpdateAttendance()
    isLoading.value = false
  }
  // TODO: apply change
  function attendanceChanged(data: Attendance, type: 'isAbsent' | 'type' | 'lateTime' | 'note' | 'checked') {
    const attendance = attendances.value.find(a => a.id === data.id)
    if (!attendance) return
    const absents = [AttendanceType.ABSENT, AttendanceType.ABSENT_EXCUSED]
    const copyData = { ...data } as Attendance

    const updates: Record<string, () => void> = {
      isAbsent: () => {
        copyData.type = data.isAbsent ? AttendanceType.ABSENT : AttendanceType.PRESENT
        grid?.setCellValue(data.id, 'isAbsent', copyData.isAbsent ?? false)
        grid?.setCellValue(data.id, 'type', copyData.type)
        grid?.setCellValue(data.id, 'lateTime', 0)
      },
      type: () => {
        copyData.isAbsent = absents.includes(data.type ?? AttendanceType.PRESENT)
        grid?.setCellValue(data.id, 'type', copyData.type ?? AttendanceType.PRESENT)
        grid?.setCellValue(data.id, 'isAbsent', copyData.isAbsent)
        grid?.setCellValue(data.id, 'lateTime', copyData.type === AttendanceType.PRESENT_LATE ? data.lateTime ?? 0 : 0)
      },
      checked: () => {
        copyData.draftAt = data.checked ? null : dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')
        grid?.setCellValue(data.id, 'checked', copyData.checked ?? false)
        grid?.setCellValue(data.id, 'draftAt', copyData.draftAt)
      },
      lateTime: () => {
        grid?.setCellValue(data.id, 'lateTime', copyData.lateTime ?? 0)
      },
      note: () => {
        grid?.setCellValue(data.id, 'note', copyData.note ?? '')
      },
    }

    updates[type]?.()
    updateAttendance(copyData)
  }
  // Return store methods and state
  return {
    // State
    attendances,
    isLoading,
    item,
    itemParam,
    selectedTimetableIds,
    weekdays,

    // Attendance operations
    addAttachment,
    attendanceChanged,
    batchApplyChanged,
    batchUpdateAttendance,
    removeAttachment,

    // Grid methods
    attendanceGridConfig,
    initToolbar,
    setGridRef,

    // Timetable operations
    getAsTable,
    isValidDayForSelection,
    removeTime,
    setSelectedTimetableIds,
    toggleTimetable,
    updateTime,
    attachFile,
  }
})
