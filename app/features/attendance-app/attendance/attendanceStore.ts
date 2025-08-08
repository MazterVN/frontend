import type {
  Grid,
  GridModel,
} from '@syncfusion/ej2-vue-grids'
import { v4 as uuidv4 } from 'uuid'
import {
  AttendanceType,
  type BulkCreateUpsertTimetableInput,
  type GetTimetableAsTableQuery,
  type ListStudentServiceWithAttendanceQuery,
  type TimetablesBulkCreateUpsertTimetablesInput,
  type UpdateRelatedStudentAttendanceInput,
} from '#gql/default'

// Type definitions
type StudentService = At<ListStudentServiceWithAttendanceQuery, 'listStudentServiceWithAttendance.results'>
type Attendance = At<ListStudentServiceWithAttendanceQuery, 'listStudentServiceWithAttendance.results.attendance'>
type GetTimetable = At<GetTimetableAsTableQuery, 'getTimetableAsTable'>
type Timetable = At<GetTimetable, 'times.days'>
type TimetableTime = At<GetTimetable, 'times'>
interface AttendanceParams extends Timetable {
  studyYearId: string
  date: string
}

// Store definition
export const useAttendanceStore = defineStore('attendanceStore', () => {
  const dayjs = useDayjs()
  // State
  let grid: Grid | null = null
  const item = ref<GetTimetable>(initItem())
  const studentServices = ref<StudentService[]>([])
  const itemParam = ref<AttendanceParams>(initItemParam())
  const selectedTimetableId = ref<string | null>(null)

  // Computed
  const selectedTimetable = computed<Timetable | null>(() => {
    return item.value.times.flatMap(time => time.days).find(day => day.id === selectedTimetableId.value) || null
  })
  const attendanceIds = computed<string[]>(() => studentServices.value.map(x => x.attendance?.id ?? '').filter(Boolean).sort())

  // Watchers
  watch(() => [itemParam.value.serviceDetailId, itemParam.value.subjectGroupingId],
    ([serviceDetailId, subjectGroupingId]) => {
      if (!serviceDetailId || !subjectGroupingId) {
        resetItem()
        return
      }
      getAsTable()
    },
    { immediate: true },
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

  function initItemParam(): AttendanceParams {
    const dayjs = useDayjs()
    return {
      id: uuidv4(),
      studyYearId: '',
      date: dayjs().format('YYYY-MM-DD'),
      subjectGroupingId: '',
      subjectGroupingDetailId: '',
      daysOfWeekId: '',
      serviceDetailId: '',
    }
  }

  function resetItem() {
    item.value = initItem()
    studentServices.value = []
  }

  // Grid-related methods
  function setGridRef(instance: Grid | null): void {
    grid = instance
  }

  function attendanceGridConfig(): GridModel {
    return {
      ...globalGridConfig,
      allowPaging: false,
      dataSource: studentServices.value,
      contextMenuItems: toContextMenuItems([
        'AutoFit',
        'AutoFitAll',
        'SortAscending',
        'SortDescending',
        'FirstPage',
        'PrevPage',
        'LastPage',
        'NextPage',
      ]),
      toolbar: [
        'Search',
      ],
    }
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

  function toTimetableInput(startTime: string, endTime: string, item: Timetable): TimetablesBulkCreateUpsertTimetablesInput {
    return {
      id: item.id,
      subjectGroupingId: item.subjectGroupingId,
      subjectGroupingDetailId: item.subjectGroupingDetailId,
      serviceDetailId: item.serviceDetailId,
      daysOfWeekId: item.daysOfWeekId,
      startTime: startTime,
      endTime: endTime,
    }
  }

  // Attendance operations
  async function setSelectedTimetable(day: Timetable) {
    // Return early if day is not valid for selection
    if (!isValidDayForSelection(day)) {
      return
    }

    selectedTimetableId.value = day.id
    await fetchAttendance(day.id)
    grid?.refresh()
  }

  function isValidDayForSelection(day: Timetable): boolean {
    const isCorrectWeekday = dayjs(itemParam.value.date).isoWeekday() === day.daysOfWeekSortOrder
    const hasSubjectGrouping = !!day.subjectGroupingDetailId
    const isNotAlreadySelected = day.id !== selectedTimetableId.value

    return isCorrectWeekday && hasSubjectGrouping && isNotAlreadySelected
  }

  async function fetchAttendance(timetableId: string) {
    const filterDate = itemParam.value.date
    const result = await attendanceRepository.listStudentServiceWithAttendance(timetableId, filterDate)
    if (result && result.listStudentServiceWithAttendance?.results) {
      studentServices.value = result.listStudentServiceWithAttendance.results
      return
    }
    studentServices.value = []
  }

  function toUpdateAttendanceInput(data: Attendance): UpdateRelatedStudentAttendanceInput {
    return {
      id: data.id,
      datetime: data.datetime,
      isAbsent: data.isAbsent,
      lateTime: data.lateTime,
      note: data.note,
      studentServiceId: data.studentServiceId,
      timetableId: data.timetableId,
      type: data.type,
      draftAt: data.draftAt,
      checked: data.checked,
      attachments: [],
    }
  }

  async function updateAttendance(attendance: Attendance) {
    const input = toUpdateAttendanceInput(attendance)
    const result = await attendanceRepository.update(input.id ?? '', input)
    if (result && !result.updateRelatedStudentAttendance.errors.length) {
      showSuccessToast('បានរក្សាទុកជោគជ័យ')
    }
  }

  // TODO: Add checked
  function attendanceChanged(data: Attendance, type: 'isAbsent' | 'type' | 'lateTime' | 'note' | 'checked') {
    const absents = [AttendanceType.ABSENT, AttendanceType.ABSENT_EXCUSED]
    const copyData = { ...data } as Attendance
    const updates: Record<typeof type, () => void> = {
      isAbsent: () => {
        copyData.type = copyData.isAbsent ? AttendanceType.ABSENT : AttendanceType.PRESENT
        grid?.setCellValue(data.id, 'attendance.type', copyData.type ?? AttendanceType.PRESENT)
      },
      type: () => {
        copyData.isAbsent = absents.includes(copyData.type ?? AttendanceType.PRESENT)
        grid?.setCellValue(data.id, 'attendance.isAbsent', copyData.isAbsent ?? false)
      },
      lateTime: () => {},
      note: () => {},
      checked: () => {
        copyData.draftAt = copyData.checked ? null : dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')
        grid?.setCellValue(data.id, 'attendance.draftAt', copyData.draftAt ?? null)
      },
    }
    updates[type]?.()
    updateAttendance(copyData)
  }

  // Form submission
  async function submit() {
    const result = await timetableRepository.bulkCreateUpsert(
      toInput(item.value),
    )
    if (
      result
      && !result?.bulkCreateUpsertTimetable.errors.length
    ) {
      showSuccessToast('បានរក្សាទុកជោគជ័យ')
    }
  }

  function toInput(item: GetTimetable): BulkCreateUpsertTimetableInput {
    return {
      subjectGroupingId: item.subjectGroupingId,
      serviceDetailId: item.serviceDetailId,
      timetables: item.times.flatMap(time => time.days.map(day => toTimetableInput(time.startTime, time.endTime, day))),
    }
  }
  // Exposed store methods
  return {
    // State
    item,
    studentServices,
    itemParam,
    selectedTimetableId,
    selectedTimetable,
    attendanceIds,
    // Grid methods
    attendanceGridConfig,
    setGridRef,

    // Timetable operations
    getAsTable,
    removeTime,
    updateTime,
    setSelectedTimetable,
    isValidDayForSelection,

    // Attendance operations
    attendanceChanged,

    // Form submission
    submit,
  }
})
