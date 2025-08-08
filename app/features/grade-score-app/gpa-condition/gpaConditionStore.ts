import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import type { CreateRelatedGpaConditionInput, EditGpaConditionQuery } from '#gql'
import { GpaConditionCreate, GpaConditionEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'

export const useGpaConditionStore = defineStore('gpaConditionStore', () => {
// Types
type GpaCondition = At<EditGpaConditionQuery, 'editGpaCondition'>
type GpaConditionDetail = At<EditGpaConditionQuery, 'editGpaCondition.gpaConditionDetails'>

// Store Dependencies
const modal = useModalStore()

// State
let grid: Grid | null = null
const item = ref<GpaCondition>(initItem())
const selectedRecords = ref<GpaCondition[]>([])
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
  gpaConditionDetails: v.array(
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
  dataSource: gridDataSource(ListGpaConditionDocument),
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
  selectedRecords.value = (grid?.getSelectedRecords() || []) as GpaCondition[]
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
function initDetail(): GpaConditionDetail {
  return {
    id: uuidv4(),
    startCondOp: '>=',
    startCondValue: 0,
    endCondOp: '<',
    endCondValue: 0,
    gradeLevelId: '',
  }
}

function initItem(): GpaCondition {
  return {
    id: uuidv4(),
    name: '',
    description: '',
    passedGpa: 0,
    gpaConditionDetails: [initDetail()],
  }
}

function resetItem() {
  item.value = initItem()
}

function addDetail() {
  item.value.gpaConditionDetails.push(initDetail())
}
function removeDetail(id: string) {
  item.value.gpaConditionDetails = item.value.gpaConditionDetails.filter(detail => detail.id !== id)
}

// Data Transformation
function toInput(data: GpaCondition): CreateRelatedGpaConditionInput {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    passedGpa: data.passedGpa,
    gpaConditionDetails: data.gpaConditionDetails.map(detail => ({
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
  modal.open(GpaConditionCreate, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
    },
    onSubmit: async (evt: FormSubmitEvent<GpaCondition>) => {
      const result = await gpaConditionRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedGpaCondition.errors.length) {
        showSuccessToast('បន្ថែមបានជោគជ័យ')
        resetItem()
        refreshGrid()
      }
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

function openEditModal(id: string) {
  modal.open(GpaConditionEdit, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
      const data = await gpaConditionRepository.edit(id)
      if (data?.editGpaCondition) {
        item.value = data.editGpaCondition
      }
    },
    onSubmit: async (evt: FormSubmitEvent<GpaCondition>) => {
      const result = await gpaConditionRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedGpaCondition.errors.length) {
        showSuccessToast('កែប្រែបានជោគជ័យ')
        refreshGrid()
      }
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

  // Form
  item,
  validationSchema,
  addDetail,
  removeDetail,

  // Options
  condOpOptions,
}
})
