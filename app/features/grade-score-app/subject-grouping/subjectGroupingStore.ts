import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import type { ChangeEventArgs } from '@syncfusion/ej2-vue-dropdowns'
import { moveArrayElement, useSortable } from '@vueuse/integrations/useSortable.mjs'
import type { SortableEvent } from 'sortablejs'
import { subjectGroupingRepository } from './subjectGroupingRepository'
import type { CreateRelatedSubjectGroupingInput, EditSubjectGroupingQuery } from '#gql'
import { SubjectGroupingCreate, SubjectGroupingEdit, SubjectGroupingExport } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import { ReportFormat } from '#gql/default'

export const useSubjectGroupingStore = defineStore('subjectGroupingStore', () => {
// Types
type SubjectGrouping = At<EditSubjectGroupingQuery, 'editSubjectGrouping'>
type SubjectGroupingServiceDetail = At<EditSubjectGroupingQuery, 'editSubjectGrouping.subjectGroupingServiceDetails'>
type SubjectGroupingDetail = At<EditSubjectGroupingQuery, 'editSubjectGrouping.subjectGroupingDetails'>
type ExportParam = {
  serviceDetailId: string
  monthsOfYearId: string
}

// Store Dependencies
const modal = useModalStore()
const { start, finish } = useLoadingIndicator()

// State
let grid: Grid | null = null
const gridRef = ref<HTMLElement | null>(null)
const item = ref<SubjectGrouping>(initItem(''))
const subjectGroupingDetailRef = ref<HTMLElement | null>(null)
const selectedRecords = ref<SubjectGrouping[]>([])
const exportParam = ref<ExportParam>({
  serviceDetailId: '',
  monthsOfYearId: '',
})
const isReady = ref(false)

// Computed
const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')
const selectedRecord = computed<SubjectGrouping>(() => selectedRecords.value?.[0] ?? initItem(''))

// Validation Schema
const validationSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  studyYearId: v.pipe(v.string('Please select study year'), v.nonEmpty('Please select study year')),
  gpaConditionId: v.pipe(v.string('Please select GPA condition'), v.nonEmpty('Please select GPA condition')),
  gpa: v.pipe(
    v.number('Please enter a number'),
    v.minValue(0, 'Please enter a positive number'),
    v.maxValue(100, 'Please enter a number less than 100'),
  ),
  note: v.pipe(v.string('Please enter a note'), v.nonEmpty('Please enter a note')),
  subjectGroupingServiceDetails: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      studyYearId: v.pipe(v.string('Please select study year'), v.nonEmpty('Please select study year')),
      serviceDetail: v.object({
        serviceId: v.pipe(v.string('Please select service'), v.nonEmpty('Please select service')),
      }),
      serviceDetailId: v.pipe(v.string('Please select service'), v.nonEmpty('Please select service')),
    }),
  ),
  subjectGroupingDetails: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      subjectId: v.pipe(v.string('Please select subject'), v.nonEmpty('Please select subject')),
      scoreTypeId: v.pipe(v.string('Please select score type'), v.nonEmpty('Please select score type')),
      maxScore: v.pipe(
        v.number('Please enter a number'),
        v.minValue(0, 'Please enter a positive number'),
        v.maxValue(200, 'Please enter a number less than 200'),
      ),
      sortOrder: v.pipe(
        v.number('Please enter a number'),
        v.minValue(0, 'Please enter a positive number'),
      ),
    }),
  ),
})

// Grid Configuration
const gridToolbar = computed<ToolbarItemType[]>(() => [
  {
    text: 'បន្ថែម',
    prefixIcon: 'icon-[heroicons--plus-20-solid] !w-4 !h-4',
    id: 'add',
    click: () => openCreateModal(),
  },
  {
    text: 'កែ',
    prefixIcon: 'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4',
    id: 'edit',
    click: () => openEditModal(selectedRecordId.value),
    disabled: selectedRecords.value.length !== 1,
  },
  {
    text: 'នាំចេញ',
    prefixIcon: 'icon-[prime--file-export] !w-4 !h-4',
    id: 'export',
    click: () => openExportModal(selectedRecordId.value),
    disabled: selectedRecords.value.length !== 1,
  },
  'Search',
])

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
      {
        field: 'studyYear.value',
        direction: 'Descending',
      },
    ],
  },
  selectionSettings: {
    persistSelection: true,
    checkboxMode: 'ResetOnRowClick',
  },
})

// Grid Methods
function handleRowSelect(_args: RowSelectEventArgs): void {
  selectedRecords.value = (grid?.getSelectedRecords() || []) as SubjectGrouping[]
}

function handleRowDeselect(_args: RowDeselectEventArgs): void {
  selectedRecords.value = []
}

const setGrid = (component: GridComponent | null): void => {
  grid = component?.ej2Instances ?? null
}

const refreshGrid = () => {
  grid?.refresh()
}

// Item Management Methods
function initServiceDetail(studyYearId: string): SubjectGroupingServiceDetail {
  return {
    id: uuidv4(),
    studyYearId: studyYearId,
    serviceDetailId: '',
    serviceDetail: {
      serviceId: '',
    },
  }
}

function initDetail(sortOrder: number): SubjectGroupingDetail {
  return {
    id: uuidv4(),
    subjectId: '',
    scoreTypeId: '',
    maxScore: 0,
    sortOrder: sortOrder,
  }
}

function initItem(studyYearId: string): SubjectGrouping {
  return {
    id: uuidv4(),
    studyYearId: studyYearId,
    gpaConditionId: '',
    gpa: 0,
    note: '',
    subjectGroupingServiceDetails: [initServiceDetail(studyYearId)],
    subjectGroupingDetails: [initDetail(1)],
  }
}

function resetItem() {
  item.value = initItem('')
}

function addServiceDetail() {
  item.value.subjectGroupingServiceDetails.push(initServiceDetail(item.value.studyYearId))
}

function removeServiceDetail(id: string) {
  item.value.subjectGroupingServiceDetails = item.value.subjectGroupingServiceDetails.filter(detail => detail.id !== id)
}

function addDetail() {
  const sortOrder = item.value.subjectGroupingDetails.length + 1
  item.value.subjectGroupingDetails.push(initDetail(sortOrder))
}

function removeDetail(id: string) {
  item.value.subjectGroupingDetails = item.value.subjectGroupingDetails.filter(detail => detail.id !== id)
}

function studyYearChanged(args: ChangeEventArgs) {
  const studyYear = args.value as string
  item.value.subjectGroupingServiceDetails.forEach((detail) => {
    detail.serviceDetail.serviceId = ''
    detail.studyYearId = studyYear
  })
  item.value.subjectGroupingDetails.forEach(detail => detail.subjectId = '')
}

function handleSubjectGroupingDetailDraggable() {
  const { option } = useSortable(subjectGroupingDetailRef, item.value.subjectGroupingDetails,
    {
      handle: '.handle',
      onUpdate: (e: SortableEvent) => {
        if (e.oldIndex === undefined || e.newIndex === undefined) return
        moveArrayElement(item.value.subjectGroupingDetails, e.oldIndex, e.newIndex, e)
        nextTick(() => {
          // Update sort order
          item.value.subjectGroupingDetails.forEach((detail, index) => {
            detail.sortOrder = index + 1
          })
        })
      },
    },
  )
  option('animation', 200)
}

// Data Transformation
function toInput(data: SubjectGrouping): CreateRelatedSubjectGroupingInput {
  return {
    id: data.id,
    studyYearId: data.studyYearId,
    gpaConditionId: data.gpaConditionId,
    gpa: data.gpa,
    note: data.note,
    subjectGroupingServiceDetails: data.subjectGroupingServiceDetails.map(detail => ({
      id: detail.id,
      studyYearId: detail.studyYearId,
      serviceDetailId: detail.serviceDetailId,
    })),
    subjectGroupingDetails: data.subjectGroupingDetails.map(detail => ({
      id: detail.id,
      subjectId: detail.subjectId,
      scoreTypeId: detail.scoreTypeId,
      maxScore: detail.maxScore,
      sortOrder: detail.sortOrder,
    })),
  }
}

// Modal Methods
function openCreateModal() {
  isReady.value = false
  modal.open(SubjectGroupingCreate, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
      handleSubjectGroupingDetailDraggable()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<SubjectGrouping>) => {
      start()
      const result = await subjectGroupingRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedSubjectGrouping.errors.length) {
        showSuccessToast('បន្ថែមបានជោគជ័យ')
        resetItem()
        refreshGrid()
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

function openEditModal(id: string) {
  isReady.value = false
  modal.open(SubjectGroupingEdit, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      start()
      resetItem()
      const data = await subjectGroupingRepository.edit(id)
      if (data?.editSubjectGrouping) {
        item.value = data.editSubjectGrouping
      }
      handleSubjectGroupingDetailDraggable()
      await delay()
      finish()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<SubjectGrouping>) => {
      start()
      const result = await subjectGroupingRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedSubjectGrouping.errors.length) {
        showSuccessToast('កែប្រែបានជោគជ័យ')
        refreshGrid()
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

function openExportModal(id: string) {
  modal.open(SubjectGroupingExport, {
    subjectGroupingId: id,
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
    },
    onExport: async (evt: SubjectGroupingExportCommand) => {
      start()
      switch (evt) {
        case 'score-monthly-certificate':
          await exportScoreMonthlyCertificate(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId)
          break
        case 'score-monthly-transcript':
          await exportScoreMonthlyTranscript(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId)
          break
        case 'score-monthly-ranking-table':
          await exportScoreMonthlyRankingTable(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId, ReportFormat.PDF)
          break
        case 'score-monthly-ranking-table-excel':
          await exportScoreMonthlyRankingTable(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId, ReportFormat.XLSX)
          break
        case 'score-monthly-check-list':
          await exportScoreMonthlyCheckList(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId)
          break
        case 'score-monthly-check-list-template':
          await exportScoreMonthlyCheckListTemplate(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId)
          break
        case 'score-monthly-honor-list':
          await exportScoreMonthlyHonorList(selectedRecord.value.id, selectedRecord.value.studyYearId, [exportParam.value.serviceDetailId], exportParam.value.monthsOfYearId)
          break
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}
async function exportScoreMonthlyCertificate(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string) {
  const data = await subjectGroupingRepository.exportScoreMonthlyCertificate(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  if (data?.exportScoreMonthlyCertificate) {
    await downloadFile(data.exportScoreMonthlyCertificate)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreMonthlyTranscript(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string) {
  const data = await subjectGroupingRepository.exportScoreMonthlyTranscript(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  if (data?.exportScoreMonthlyTranscript) {
    await downloadFile(data.exportScoreMonthlyTranscript)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreMonthlyRankingTable(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string, format: ReportFormat) {
  const data = await subjectGroupingRepository.exportScoreMonthlyRankingTable(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId, format)
  if (data?.exportScoreMonthlyRankingTable) {
    await downloadFile(data.exportScoreMonthlyRankingTable)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreMonthlyCheckList(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string) {
  const data = await subjectGroupingRepository.exportScoreMonthlyCheckList(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  if (data?.exportScoreMonthlyCheckList) {
    await downloadFile(data.exportScoreMonthlyCheckList)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreMonthlyCheckListTemplate(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string) {
  const data = await subjectGroupingRepository.exportScoreMonthlyCheckListTemplate(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  if (data?.exportScoreMonthlyCheckListTemplate) {
    await downloadFile(data.exportScoreMonthlyCheckListTemplate)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreMonthlyHonorList(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string) {
  const data = await subjectGroupingRepository.exportScoreMonthlyHonorList(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  if (data?.exportScoreMonthlyHonorList) {
    await downloadFile(data.exportScoreMonthlyHonorList)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

// Public API
return {
  // Grid
  gridConfig,
  gridToolbar,
  gridRef,
  setGrid,
  subjectGroupingDetailRef,
  handleRowSelect,
  handleRowDeselect,
  // State
  exportParam,
  isReady,
  // Form
  item,
  validationSchema,
  addServiceDetail,
  removeServiceDetail,
  addDetail,
  removeDetail,
  studyYearChanged,
}
})
