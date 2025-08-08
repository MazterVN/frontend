import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import { studentNoteReportRepository } from './studentNoteReportRepository'
import type { GetStudentNoteReportQuery, ListStudentNoteReportQuery } from '#gql'
import { StudentNoteReportDetail } from '#components'

export const useStudentNoteReportStore = defineStore('studentNoteReportStore', () => {
  // Types
  type StudentNoteReport = At<ListStudentNoteReportQuery, 'listStudentNoteReport.results'>
  type StudentNoteReportDetail = At<GetStudentNoteReportQuery, 'getStudentNoteReport'>
  type StudentNoteAttachment = At<GetStudentNoteReportQuery, 'getStudentNoteReport.attachments'>
  type FilterParam = {
    startDate: string
    endDate: string
  }

  // Store Dependencies
  const modal = useModalStore()
  const studentNoteStore = useStudentNoteStore()
  const { start, finish } = useLoadingIndicator()

  // State
  let grid: Grid | null = null
  let gridDetail: Grid | null = null
  const item = ref<StudentNoteReportDetail>(initItem())
  const selectedRecords = ref<StudentNoteReport[]>([])
  const selectedRecordAttachments = ref<StudentNoteAttachment[]>([])
  const isReady = ref(false)
  const filterParam = ref<FilterParam>({
    startDate: '',
    endDate: '',
  })

  // Computed
  const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')
  const selectedStudentNoteId = computed<string>(() => selectedRecordAttachments.value?.[0]?.studentNote?.id ?? '')
  const gridDataSource = computed(() => gridDataSourceVars(ListStudentNoteReportDocument, {
    ...(filterParam.value.endDate && { startDate: filterParam.value.startDate, endDate: filterParam.value.endDate }),
  }))

  // Grid Configuration
  const gridToolbar = computed<ToolbarItemType[]>(() => [
    {
      text: 'មើល',
      prefixIcon: 'icon-[heroicons--eye-20-solid] !w-4 !h-4',
      id: 'view',
      click: () => openDetailModal(selectedRecordId.value),
      disabled: selectedRecords.value.length !== 1,
    },
    'Search',
  ])

  const gridDetailToolbar = computed<ToolbarItemType[]>(() => [
    {
      text: 'កែ',
      prefixIcon: 'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4',
      id: 'edit',
      click: () => studentNoteStore.openEditModal(selectedStudentNoteId.value),
      disabled: selectedRecordAttachments.value.length !== 1,
    },
    'Search',
  ])

  const gridConfig = (): GridModel => ({
    ...globalGridConfig,
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
    selectionSettings: {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    },
    allowGrouping: true,
    groupSettings: {
      showDropArea: false,
      columns: ['studyYear.nameLocalized', 'serviceName.nameLocalized'],
    },
    sortSettings: {
      columns: [
        { field: 'studyYear.nameLocalized', direction: 'Descending' },
        { field: 'serviceName.nameLocalized', direction: 'Descending' },
        { field: 'student.name', direction: 'Ascending' },
      ],
    },
  })

  const gridConfigDetail = (): GridModel => ({
    ...globalGridConfig,
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
    selectionSettings: {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    },
    allowGrouping: true,
    groupSettings: {
      showDropArea: false,
      columns: ['typeNameLocalized'],
    },
    height: 400,
  })

  // Grid Methods
  function handleRowSelect(_args: RowSelectEventArgs): void {
    selectedRecords.value = (grid?.getSelectedRecords() || []) as StudentNoteReport[]
  }

  function handleRowDeselect(_args: RowDeselectEventArgs): void {
    selectedRecords.value = []
  }

  function handleRowSelectDetail(_args: RowSelectEventArgs): void {
    selectedRecordAttachments.value = (gridDetail?.getSelectedRecords() || []) as StudentNoteAttachment[]
  }

  function handleRowDeselectDetail(_args: RowDeselectEventArgs): void {
    selectedRecordAttachments.value = []
  }

  const setGrid = (component: GridComponent | null): void => {
    grid = component?.ej2Instances ?? null
  }

  const setGridDetail = (component: GridComponent | null): void => {
    gridDetail = component?.ej2Instances ?? null
  }

  function initItem(): StudentNoteReportDetail {
    return {
      id: '',
      studyYear: {
        nameLocalized: '',
      },
      serviceName: {
        nameLocalized: '',
      },
      student: {
        name: '',
        latin: '',
        i18nGender: {
          nameLocalized: '',
        },
        s3ProfileUri: '',
      },
      studentNotePerformanceImprovementLetter: 0,
      studentNoteWarningLetter: 0,
      studentNoteContract: 0,
      studentNoteOther: 0,
      attachments: [],
    }
  }

  function resetItem() {
    item.value = initItem()
  }

  async function presignedAndDownloadFile(uri: string) {
    start()
    const presignedUrl = await mediaRepository.uriToPresignedUrl(uri)
    if (presignedUrl?.uriToPresignedUrl) {
      window.open(presignedUrl.uriToPresignedUrl, '_blank')
    }
    await delay()
    finish()
  }

  const refreshGrid = () => {
    grid?.refresh()
  }

  // Modal Methods
  function openDetailModal(id: string) {
    isReady.value = false
    modal.open(StudentNoteReportDetail, {
      ui: {
        width: 'w-full sm:max-w-4xl',
      },
      fullscreen: false,

      onInit: async () => {
        start()
        resetItem()
        const data = await studentNoteReportRepository.get({
          id,
          ...(filterParam.value.endDate && { endDate: filterParam.value.endDate, startDate: filterParam.value.startDate }),
        })
        if (data?.getStudentNoteReport) {
          item.value = data.getStudentNoteReport
        }
        await delay()
        finish()
        isReady.value = true
      },

    })
  }
  // Public API
  return {
    // Grid
    gridConfig,
    gridConfigDetail,
    gridToolbar,
    gridDetailToolbar,
    setGrid,
    setGridDetail,
    handleRowSelect,
    handleRowDeselect,
    handleRowSelectDetail,
    handleRowDeselectDetail,
    gridDataSource,
    // State
    isReady,
    item,
    filterParam,
    refreshGrid,
    presignedAndDownloadFile,
  }
})
