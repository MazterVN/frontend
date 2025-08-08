import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import { moveArrayElement, useSortable } from '@vueuse/integrations/useSortable.mjs'
import type { SortableEvent } from 'sortablejs'
import { gradeScoreTemplateRepository } from './gradeScoreTemplateRepository'
import type { CreateRelatedGradeScoreTemplateInput, EditGradeScoreTemplateQuery } from '#gql'
import { GradeScoreTemplateCreate, GradeScoreTemplateEdit, GradeScoreTemplateExport } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import { ReportFormat, ExamType } from '#gql/default'

export const useGradeScoreTemplateStore = defineStore('gradeScoreTemplateStore', () => {
// Types
type GradeScoreTemplate = At<EditGradeScoreTemplateQuery, 'editGradeScoreTemplate'>
type GradeScoreTemplateDetail = At<EditGradeScoreTemplateQuery, 'editGradeScoreTemplate.gradeScoreTemplateDetails'>
type ExportParam = {
  serviceDetailId: string
}

// Store Dependencies
const modal = useModalStore()
const { start, finish } = useLoadingIndicator()

// State
let grid: Grid | null = null
const item = ref<GradeScoreTemplate>(initItem())
const selectedRecords = ref<GradeScoreTemplate[]>([])
const selectedRecord = computed<GradeScoreTemplate | null>(() => selectedRecords.value?.[0] ?? null)
const selectedRecordId = computed<string>(() => selectedRecord.value?.id ?? '')
const gradeScoreTemplateDetailRef = ref<HTMLElement | null>(null)
const exportParam = ref<ExportParam>({
  serviceDetailId: '',
})
const isReady = ref(false)

// Validation Schema
const validationSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
  nameEn: v.pipe(v.string('Please enter an English name'), v.nonEmpty('Please enter an English name')),
  note: v.pipe(v.string('Please enter a note'), v.nonEmpty('Please enter a note')),
  subjectGroupingId: v.pipe(v.string('Please select subject grouping'), v.nonEmpty('Please select subject grouping')),
  subjectGrouping: v.object({
    studyYearId: v.pipe(v.string('Please select study year'), v.nonEmpty('Please select study year')),
  }),
  gradeScoreTemplateDetails: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      monthsOfYearId: v.pipe(v.string('Please select month'), v.nonEmpty('Please select month')),
      type: v.pipe(v.string('Please select type'), v.nonEmpty('Please select type')),
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
    click: () => openExportModal(selectedRecordId.value, selectedRecord.value?.subjectGroupingId ?? ''),
    disabled: selectedRecords.value.length !== 1,
  },
  'Search',
])

const gridConfig = (): GridModel => ({
  ...globalGridConfig,
  dataSource: gridDataSource(ListGradeScoreTemplateDocument),
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
    columns: ['subjectGrouping.studyYear.value'],
  },
  sortSettings: {
    columns: [
      {
        field: 'subjectGrouping.studyYear.value',
        direction: 'Descending',
      },
    ],
  },
})

// Grid Methods
function handleRowSelect(_args: RowSelectEventArgs): void {
  selectedRecords.value = (grid?.getSelectedRecords() || []) as GradeScoreTemplate[]
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
function initDetail(): GradeScoreTemplateDetail {
  return {
    id: uuidv4(),
    monthsOfYearId: '',
    type: ExamType.MONTHLY,
    sortOrder: 0,
  }
}

function initItem(): GradeScoreTemplate {
  return {
    id: uuidv4(),
    name: '',
    nameEn: '',
    note: '',
    subjectGrouping: {
      studyYearId: '',
    },
    subjectGroupingId: '',
    gradeScoreTemplateDetails: [initDetail()],
  }
}

function resetItem() {
  item.value = initItem()
}

function addDetail() {
  item.value.gradeScoreTemplateDetails.push(initDetail())
}

function removeDetail(id: string) {
  item.value.gradeScoreTemplateDetails = item.value.gradeScoreTemplateDetails.filter(detail => detail.id !== id)
}

function handleGradeScoreTemplateDetailDraggable() {
  const { option } = useSortable(gradeScoreTemplateDetailRef, item.value.gradeScoreTemplateDetails,
    {
      handle: '.handle',
      onUpdate: (e: SortableEvent) => {
        if (e.oldIndex === undefined || e.newIndex === undefined) return
        moveArrayElement(item.value.gradeScoreTemplateDetails, e.oldIndex, e.newIndex, e)
        nextTick(() => {
          // Update sort order
          item.value.gradeScoreTemplateDetails.forEach((detail, index) => {
            detail.sortOrder = index + 1
          })
        })
      },
    },
  )
  option('animation', 200)
}

// Data Transformation
function toInput(data: GradeScoreTemplate): CreateRelatedGradeScoreTemplateInput {
  return {
    id: data.id,
    name: data.name,
    nameEn: data.nameEn,
    note: data.note,
    subjectGroupingId: data.subjectGroupingId,
    gradeScoreTemplateDetails: data.gradeScoreTemplateDetails.map(detail => ({
      id: detail.id,
      monthsOfYearId: detail.monthsOfYearId,
      type: detail.type,
      sortOrder: detail.sortOrder,
    })),
  }
}

// Modal Methods
function openCreateModal() {
  isReady.value = false
  modal.open(GradeScoreTemplateCreate, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
      handleGradeScoreTemplateDetailDraggable()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<GradeScoreTemplate>) => {
      start()
      const result = await gradeScoreTemplateRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedGradeScoreTemplate.errors.length) {
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
  modal.open(GradeScoreTemplateEdit, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      start()
      resetItem()
      const data = await gradeScoreTemplateRepository.edit(id)
      if (data?.editGradeScoreTemplate) {
        item.value = data.editGradeScoreTemplate
      }
      handleGradeScoreTemplateDetailDraggable()
      await delay()
      finish()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<GradeScoreTemplate>) => {
      start()
      const result = await gradeScoreTemplateRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedGradeScoreTemplate.errors.length) {
        showSuccessToast('កែប្រែបានជោគជ័យ')
        refreshGrid()
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

function openExportModal(id: string, subjectGroupingId: string) {
  modal.open(GradeScoreTemplateExport, {
    gradeScoreTemplateId: id,
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
    },
    onExport: async (evt: GradeScoreTemplateExportCommand) => {
      start()
      switch (evt) {
        case 'score-semester-list':
          await exportScoreSemesterList(id, exportParam.value.serviceDetailId, subjectGroupingId)
          break
        case 'score-semester-list-summary':
          await exportScoreSemesterListSummary(id, exportParam.value.serviceDetailId, subjectGroupingId, ReportFormat.PDF)
          break
        case 'score-semester-list-summary-xlsx':
          await exportScoreSemesterListSummary(id, exportParam.value.serviceDetailId, subjectGroupingId, ReportFormat.XLSX)
          break
        case 'score-semester-certificate':
          await exportScoreSemesterCertificate(id, exportParam.value.serviceDetailId, subjectGroupingId)
          break
        case 'score-semester-certificate-formal':
          await exportScoreSemesterCertificateFormal(id, exportParam.value.serviceDetailId, subjectGroupingId)
          break
        case 'score-semester-transcript':
          await exportScoreSemesterTranscript(id, exportParam.value.serviceDetailId, subjectGroupingId)
          break
        case 'score-semester-honor-list':
          await exportScoreSemesterHonorList(id, exportParam.value.serviceDetailId, subjectGroupingId)
          break
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

async function exportScoreSemesterList(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string) {
  const data = await gradeScoreTemplateRepository.exportScoreSemesterList(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  if (data?.exportScoreSemesterList) {
    await downloadFile(data.exportScoreSemesterList)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreSemesterListSummary(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string, format: ReportFormat) {
  const data = await gradeScoreTemplateRepository.exportScoreSemesterListSummary(gradeScoreTemplateId, serviceDetailId, subjectGroupingId, format)
  if (data?.exportScoreSemesterListSummary) {
    await downloadFile(data.exportScoreSemesterListSummary)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreSemesterCertificate(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string) {
  const data = await gradeScoreTemplateRepository.exportScoreSemesterCertificate(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  if (data?.exportScoreSemesterCertificate) {
    await downloadFile(data.exportScoreSemesterCertificate)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreSemesterCertificateFormal(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string) {
  const data = await gradeScoreTemplateRepository.exportScoreSemesterCertificateFormal(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  if (data?.exportScoreSemesterCertificateFormal) {
    await downloadFile(data.exportScoreSemesterCertificateFormal)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreSemesterTranscript(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string) {
  const data = await gradeScoreTemplateRepository.exportScoreSemesterTranscript(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  if (data?.exportScoreSemesterTranscript) {
    await downloadFile(data.exportScoreSemesterTranscript)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

async function exportScoreSemesterHonorList(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string) {
  const data = await gradeScoreTemplateRepository.exportScoreSemesterHonorList(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  if (data?.exportScoreSemesterHonorList) {
    await downloadFile(data.exportScoreSemesterHonorList)
    showSuccessToast('បាននាំចេញជោគជ័យ')
  }
}

// Public API
return {
  // Grid
  gridConfig,
  gridToolbar,
  setGrid,
  handleRowSelect,
  handleRowDeselect,
  gradeScoreTemplateDetailRef,
  // State
  exportParam,
  isReady,
  // Form
  item,
  validationSchema,
  addDetail,
  removeDetail,
}
})
