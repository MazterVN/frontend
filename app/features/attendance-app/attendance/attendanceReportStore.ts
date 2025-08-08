import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import type { ClickEventArgs } from '@syncfusion/ej2-navigations'
import { v4 as uuidv4 } from 'uuid'
import type { GetTimetableAsTableQuery } from '#gql/default'

// Types
type GetTimetable = At<GetTimetableAsTableQuery, 'getTimetableAsTable'>
interface TimetableParam extends At<GetTimetable, 'times.days'> {
  studyYearId: string
  startDate: string
  endDate: string
}

export const useAttendanceReportStore = defineStore(
  'attendanceReportStore',
  () => {
    // State
    let grid: Grid | null = null
    const itemParam = ref<TimetableParam>(initItemParam())

    // Initialization helpers
    function initItemParam(): TimetableParam {
      return {
        id: uuidv4(),
        studyYearId: '',
        startDate: '',
        endDate: '',
        subjectGroupingId: '',
        subjectGroupingDetailId: '',
        daysOfWeekId: '',
        serviceDetailId: '',
      }
    }

    // Grid-related methods
    const gridConfig = (): GridModel => ({
      ...globalGridConfig,
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
      groupSettings: {
        showDropArea: false,
        columns: ['studyYear.value', 'serviceName.nameLocalized'],
      },
      sortSettings: {
        columns: [
          { field: 'studyYear.value', direction: 'Descending' },
          { field: 'serviceName.nameLocalized', direction: 'Ascending' },
          { field: 'student.name', direction: 'Ascending' },
        ],
      },
      toolbar: ['Search'],
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
      grid?.toolbarModule.enableItems(['edit'], selectedRecords?.length === 1)
      grid?.contextMenuModule.contextMenu.enableItems(
        ['Edit'],
        selectedRecords?.length === 1,
      )
    }

    function handleRowDeselect(_args: RowDeselectEventArgs): void {
      const selectedRecords = grid?.getSelectedRecords()
      grid?.toolbarModule.enableItems(['edit'], selectedRecords?.length === 1)
      grid?.contextMenuModule.contextMenu.enableItems(
        ['Edit'],
        selectedRecords?.length === 1,
      )
    }

    // Return store methods and state
    return {
      // State
      itemParam,
      // Grid methods
      gridConfig,
      initToolbar,
      setGridRef,
    }
  },
)
