// Types and Imports
import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import type { BatchUpdateGradeScoreInput, GradeScoresBatchUpdateGradeScoresInput, ListStudentServiceWithScoreQuery, ListSubjectGroupingQuery } from '#gql'
import { StudentScoreEntry } from '#components'

// Type Definitions
type SubjectGrouping = At<ListSubjectGroupingQuery, 'listSubjectGroupings.results'>
type StudentService = At<ListStudentServiceWithScoreQuery, 'listStudentServiceWithScore.results'>
type Score = At<ListStudentServiceWithScoreQuery, 'listStudentServiceWithScore.results.scores'>
type FilterParams = {
  serviceDetailId: string
  subjectGroupingDetailIds: string[]
  monthOfYearId: string
}

// Store Definition
export const useStudentScoreStore = defineStore('studentScoreStore', () => {
  // StoreDependencies
  const modal = useModalStore()

  // State Management
  const filterParam = ref<FilterParams>(initFilterParams())
  const studentServices = ref<StudentService[]>([])
  const isLoading = ref(false)
  let grid: Grid | null = null
  let scoreGrid: Grid | null = null
  const selectedRecords = ref<SubjectGrouping[]>([])

  // Computed Properties
  const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')
  const scoreHeaders = computed<Score[]>(() => {
    return studentServices.value?.[0]?.scores || []
  })

  const gridToolbar = computed<ToolbarItemType[]>(() => [
    {
      text: 'ពិន្ទុ',
      prefixIcon: 'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4',
      id: 'score',
      click: () => openScoreEntryModal(selectedRecordId.value),
      disabled: selectedRecords.value.length !== 1,
    },
    'Search',
  ])

  // Grid Configuration
  const gridConfig = (): GridModel => ({
    ...globalGridConfig,
    dataSource: gridDataSource(ListSubjectGroupingDocument),
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
    allowGrouping: true,
    groupSettings: {
      showDropArea: false,
      columns: ['studyYear.value'],
    },
    sortSettings: {
      columns: [
        { field: 'studyYear.value', direction: 'Descending' },
      ],
    },
    selectionSettings: {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    },
  })

  // Grid methods
  function handleRowSelect(_args: RowSelectEventArgs): void {
    selectedRecords.value = (grid?.getSelectedRecords() || []) as SubjectGrouping[]
  }

  function handleRowDeselect(_args: RowDeselectEventArgs): void {
    selectedRecords.value = []
  }

  // Grid Reference Setters
  const setGrid = (component: GridComponent | null): void => {
    grid = component?.ej2Instances ?? null
  }
  const setScoreGrid = (component: GridComponent | null): void => {
    scoreGrid = component?.ej2Instances ?? null
  }

  // Initialization Functions
  function initFilterParams(): FilterParams {
    return {
      serviceDetailId: '',
      subjectGroupingDetailIds: [],
      monthOfYearId: '',
    }
  }

  // Watchers
  watch(() => [filterParam.value.serviceDetailId, filterParam.value.subjectGroupingDetailIds, filterParam.value.monthOfYearId] as const,
    async ([serviceDetailId, subjectGroupingDetailIds, monthOfYearId]: readonly [string, string[], string]) => {
      if (!serviceDetailId || !subjectGroupingDetailIds.length || !monthOfYearId) {
        studentServices.value = []
        return
      }
      await loadScoreGrid()
    },
    { immediate: true },
  )

  // Grid Event Handlers
  function openScoreEntryModal(subjectGroupingId: string): void {
    modal.open(StudentScoreEntry, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-full mx-2',
      },
      subjectGroupingId: subjectGroupingId,

    })
  }

  // Data Loading and Update Functions
  async function refreshScoreGrid(): Promise<void> {
    isLoading.value = true
    await loadScoreGrid()
    await delay()
    isLoading.value = false
    showSuccessToast('បានបន្ទាន់សម័យទិន្ន័យដោយជោគជ័យ')
  }

  async function loadScoreGrid(): Promise<void> {
    const data = await studentServiceRepository.listWithScore(
      selectedRecordId.value,
      [filterParam.value.serviceDetailId],
      filterParam.value.subjectGroupingDetailIds,
      filterParam.value.monthOfYearId,
    )
    if (data?.listStudentServiceWithScore?.results) {
      studentServices.value = data.listStudentServiceWithScore.results
    }
  }

  async function batchUpdateGradeScore(id: string, input: BatchUpdateGradeScoreInput): Promise<void> {
    const result = await studentScoreRepository.batchUpdateGradeScore(id, input)
    if (!result?.batchUpdateGradeScore.errors.length) {
      showSuccessToast('បានរក្សាទុកបានជោគជ័យ')
    }
  }

  function toGradeScoreInput(items: Score[]): GradeScoresBatchUpdateGradeScoresInput[] {
    return items.map(item => ({
      id: item.id,
      score: item.score,
    }))
  }

  // Grid Configurations
  const scoreGridConfig = (): GridModel => ({
    allowSorting: true,
    allowResizing: true,
    gridLines: 'Both',
    height: 680,
    beforeBatchSave: (args: {
      batchChanges: { changedRecords: StudentService[] }
    }) => {
      const changedRecords = args.batchChanges.changedRecords
      const changedScores = changedRecords.map(record => record.scores).flat()
      const previousRecords = scoreGrid?.getCurrentViewRecords() as StudentService[]
      const previousScores = previousRecords.flatMap(record => record.scores)
      const inputs = useArrayDifference(
        changedScores,
        previousScores,
        (a, b) => a.id === b.id && a.score == b.score,
      )
      const id = inputs.value[0]?.id ?? ''
      batchUpdateGradeScore(id, {
        gradeScores: toGradeScoreInput(inputs.value),
      })
    },
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
    editSettings: {
      allowEditing: true,
      mode: 'Batch',
    },
  })

  // Public Store Interface
  return {
    // Grid configs
    gridConfig,
    gridToolbar,
    scoreGridConfig,
    handleRowSelect,
    handleRowDeselect,

    // Grid refs
    setGrid,
    setScoreGrid,

    // Grid actions
    refreshScoreGrid,

    // Grid data
    filterParam,
    studentServices,
    scoreHeaders,

    // State
    isLoading,
    selectedRecords,
  }
})
