import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import type { ClickEventArgs } from '@syncfusion/ej2-navigations'
import {
  AttendanceType,
  type ListStudentServiceWithAttendanceQuery,
  type ListTimetablesForEmployeeQuery,
  type UpdateRelatedStudentAttendanceInput,
} from '#gql/default'

// Type definitions
type StudentService = At<ListStudentServiceWithAttendanceQuery, 'listStudentServiceWithAttendance.results'>
type Attendance = At<ListStudentServiceWithAttendanceQuery, 'listStudentServiceWithAttendance.results.attendance'>
type Timetable = At<ListTimetablesForEmployeeQuery, 'listTimetables.results'>

// Store definition
export const useAttendanceCheckInStore = defineStore('attendanceCheckInStore', () => {
  const dayjs = useDayjs()
  // State
  let grid: Grid | null = null
  const timetables = ref<Timetable[]>([])
  const attendances = ref<StudentService[]>([])
  const selectedTimetableId = ref<string | null>(null)
  const { user } = useAuthentication()
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null)

  // Watch user employeeId
  watch(() => user.employeeId, async (employeeId) => {
    // Clear any existing interval
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }

    if (!employeeId) return

    await getAsTable()
    await setCurrentTimetable()
    // Store the interval ID every 1 minutes
    intervalId.value = setInterval(setCurrentTimetable, 1000 * 60 * 1)
  }, { immediate: true })

  async function setCurrentTimetable() {
    const serverDateTime = await userRepository.currentUserDatetime()
    const currentTime = dayjs(serverDateTime.currentUserDatetime)
    const currentUnix = currentTime.unix()

    const timetable = timetables.value.find((timetable) => {
      const startTime = dayjs(timetable.startTime, 'HH:mm:ss').unix()
      const endTime = dayjs(timetable.endTime, 'HH:mm:ss').unix()
      return currentUnix >= startTime && currentUnix <= endTime
    })

    // Don't update if already selected
    if (selectedTimetableId.value === timetable?.id) {
      return
    }

    // Update selected timetable and fetch attendance if found
    if (timetable) {
      selectedTimetableId.value = timetable.id
      fetchAttendance(timetable.id)
    }
  }

  // Computed
  const selectedTimetable = computed<Timetable | null>(() => {
    return timetables.value.find(timetable => timetable.id === selectedTimetableId.value) || null
  })
  // Grid-related methods
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

  function attendanceGridConfig(): GridModel {
    return {
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
      toolbar: [
        'Search',
      ],
    }
  }

  // Timetable operations
  async function getAsTable() {
    const weekDay = dayjs().isoWeekday()
    const data = await attendanceRepository.listTimetablesForEmployee(user.employeeId ?? '', weekDay)
    if (data?.listTimetables?.results) {
      timetables.value = data.listTimetables.results
    }
  }

  // Attendance operations

  async function fetchAttendance(timetableId: string) {
    const filterDate = dayjs().format('YYYY-MM-DD')
    const result = await attendanceRepository.listStudentServiceWithAttendance(timetableId, filterDate)
    if (result && result.listStudentServiceWithAttendance?.results) {
      attendances.value = result.listStudentServiceWithAttendance.results
      return
    }
    attendances.value = []
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
    const studentService = attendances.value.find(service => service.attendance?.id === data.id)
    if (!studentService?.attendance) return

    const attendance = studentService.attendance
    const absents = [AttendanceType.ABSENT, AttendanceType.ABSENT_EXCUSED]

    const updates: Record<typeof type, () => void> = {
      isAbsent: () => {
        attendance.isAbsent = data.isAbsent
        attendance.type = data.isAbsent ? AttendanceType.ABSENT : AttendanceType.PRESENT
        grid?.setCellValue(data.id, 'type', attendance.type)
      },
      type: () => {
        attendance.type = data.type
        attendance.isAbsent = absents.includes(data.type ?? AttendanceType.PRESENT)
        grid?.setCellValue(data.id, 'isAbsent', attendance.isAbsent)
        grid?.setCellValue(data.id, 'lateTime', attendance.lateTime ?? 0)
      },
      lateTime: () => {
        attendance.lateTime = data.lateTime
      },
      note: () => {
        attendance.note = data.note
      },
      checked: () => {
        attendance.checked = data.checked
        attendance.draftAt = data.checked ? null : dayjs().format('YYYY-MM-DDTHH:mm:ss[Z]')
        grid?.setCellValue(data.id, 'draftAt', attendance.draftAt)
      },
    }

    updates[type]?.()
    updateAttendance(attendance)
  }

  // Add cleanup function that can be called when store is no longer needed
  function cleanup() {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  // Exposed store methods
  return {
    // State
    timetables,
    attendances,
    selectedTimetableId,
    selectedTimetable,

    // Grid methods
    attendanceGridConfig,
    setGridRef,
    initToolbar,

    // Timetable operations
    getAsTable,

    // Attendance operations
    attendanceChanged,

    cleanup,
  }
})
