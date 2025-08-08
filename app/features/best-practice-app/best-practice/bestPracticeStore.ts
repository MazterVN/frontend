import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import { bestPracticeRepository } from './bestPracticeRepository'
import type { CreateRelatedBestPracticeInput, EditBestPracticeQuery } from '#gql'
import { BestPracticeCreate, BestPracticeEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'

export const useBestPracticeStore = defineStore('bestPracticeStore', () => {
// Types
type BestPractice = At<EditBestPracticeQuery, 'editBestPractice'>
type BestPracticeDetail = At<EditBestPracticeQuery, 'editBestPractice.bestPractices'>

// Store Dependencies
const modal = useModalStore()
const { start, finish } = useLoadingIndicator()

// State
let grid: Grid | null = null
const item = ref<BestPractice>(initItem())
const selectedRecords = ref<BestPractice[]>([])
const isReady = ref(false)

// Computed
const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')

// Constants
const condOpOptions = ['<', '>', '<=', '>=']

// Validation Schema
const validationSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
  description: v.pipe(v.string('Please enter a description'), v.nonEmpty('Please enter a description')),
  passedGpa: v.pipe(
    v.number('Please enter a number'),
    v.minValue(0, 'Please enter a positive number'),
    v.maxValue(100, 'Please enter a number less than 100'),
  ),
  bestPractices: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      startCondOp: v.pipe(v.string('Please select condition'), v.nonEmpty('Please select condition')),
      startCondValue: v.pipe(
        v.number('Please enter a number'),
        v.minValue(0, 'Please enter a positive number'),
        v.maxValue(100, 'Please enter a number less than 100'),
      ),
      endCondOp: v.pipe(v.string('Please select condition'), v.nonEmpty('Please select condition')),
      endCondValue: v.pipe(
        v.number('Please enter a number'),
        v.minValue(0, 'Please enter a positive number'),
        v.maxValue(100, 'Please enter a number less than 100'),
      ),
      gradeLevelId: v.pipe(v.string('Please select grade level'), v.nonEmpty('Please select grade level')),
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
  'Search',
])

const gridConfig = (): GridModel => ({
  ...globalGridConfig,
  dataSource: gridDataSource(ListBestPracticeDocument),
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
})

// Grid Methods
function handleRowSelect(_args: RowSelectEventArgs): void {
  selectedRecords.value = (grid?.getSelectedRecords() || []) as BestPractice[]
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
function initDetail(): BestPracticeDetail {
  return {
    id: uuidv4(),
    startCondOp: '>=',
    startCondValue: 0,
    endCondOp: '<',
    endCondValue: 0,
    gradeLevelId: '',
  }
}

function initItem(): BestPractice {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    passedGpa: 0,
    bestPractices: [initDetail()],
  }
}

function resetItem() {
  item.value = initItem()
}

function addDetail() {
  item.value.bestPractices.push(initDetail())
}

function removeDetail(id: string) {
  item.value.bestPractices = item.value.bestPractices.filter(detail => detail.id !== id)
}

// Data Transformation
function toInput(data: BestPractice): CreateRelatedBestPracticeInput {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    passedGpa: data.passedGpa,
    bestPractices: data.bestPractices.map(detail => ({
      id: detail.id,
      startCondOp: detail.startCondOp,
      startCondValue: detail.startCondValue,
      endCondOp: detail.endCondOp,
      endCondValue: detail.endCondValue,
      gradeLevelId: detail.gradeLevelId,
    })),
  }
}

// Modal Methods
function openCreateModal() {
  isReady.value = false
  modal.open(BestPracticeCreate, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<BestPractice>) => {
      start()
      const result = await bestPracticeRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedBestPractice.errors.length) {
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
  modal.open(BestPracticeEdit, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      start()
      resetItem()
      const data = await bestPracticeRepository.edit(id)
      if (data?.editBestPractice) {
        item.value = data.editBestPractice
      }
      await delay()
      finish()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<BestPractice>) => {
      start()
      const result = await bestPracticeRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedBestPractice.errors.length) {
        showSuccessToast('កែប្រែបានជោគជ័យ')
        refreshGrid()
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

// Public API
return {
  // Grid
  gridConfig,
  gridToolbar,
  setGrid,
  handleRowSelect,
  handleRowDeselect,
  // State
  isReady,
  // Form
  item,
  validationSchema,
  addDetail,
  removeDetail,

  // Options
  condOpOptions,
}
})
