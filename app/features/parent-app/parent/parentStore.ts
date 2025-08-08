import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import { ParentCreate, ParentEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  ParentJob,
  ParentType,
  type CreateUpsertParentInput,
  type EditParentQuery,
} from '#gql/default'

export const useParentStore = defineStore('parentStore', () => {
  // Types
  type Parent = At<EditParentQuery, 'editParent'>

  // Store Dependencies
  const modal = useModalStore()
  const { start, finish } = useLoadingIndicator()

  // State
  let grid: Grid | null = null
  const item = ref<Parent>(initItem())
  const selectedRecords = ref<Parent[]>([])
  const isReady = ref(false)

  // Computed
  const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')

  // Validation Schema
  const validationSchema = v.object({
    id: v.pipe(v.string(), v.nonEmpty()),
    name: v.pipe(
      v.string('Please enter name'),
      v.nonEmpty('Please enter name'),
    ),
    latin: v.nullable(v.string('Please enter latin')),
    type: v.pipe(
      v.string('Please select type'),
      v.nonEmpty('Please select type'),
    ),
    job: v.pipe(
      v.string('Please select job'),
      v.nonEmpty('Please select job'),
    ),
    tel: v.pipe(
      v.string('Please enter tel'),
      v.nonEmpty('Please enter tel'),
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
    dataSource: gridDataSource(ListParentDocument),
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

  const studentServiceGridConfig = (): GridModel => ({
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
    height: 400,
    allowGrouping: true,
    groupSettings: {
      showDropArea: false,
      columns: ['studyYear.nameLocalized'],
    },
    sortSettings: {
      columns: [{ field: 'studyYear.nameLocalized', direction: 'Descending' }],
    },
    selectionSettings: {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    },
  })

  // Grid Methods
  function handleRowSelect(_args: RowSelectEventArgs): void {
    selectedRecords.value = (grid?.getSelectedRecords() || []) as Parent[]
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
  function initItem(): Parent {
    return {
      id: uuidv4(),
      name: '',
      latin: '',
      type: ParentType.FATHER,
      job: ParentJob.SELLER,
      tel: '',
      studentServices: [],
    }
  }

  function resetItem() {
    item.value = initItem()
  }

  // Data Transformation
  function toInput(data: Parent): CreateUpsertParentInput {
    return {
      id: data.id,
      name: data.name,
      latin: data.latin,
      type: data.type,
      job: data.job,
      tel: data.tel,
    }
  }

  // Modal Methods
  function openCreateModal() {
    isReady.value = false
    modal.open(ParentCreate, {
      ui: {
        width: 'w-full sm:max-w-4xl',
      },
      fullscreen: false,

      onInit: async () => {
        resetItem()
        isReady.value = true
      },
      onSubmit: async (evt: FormSubmitEvent<Parent>) => {
        start()
        const result = await parentRepository.bulkCreateUpsert(toInput(evt.data))
        if (!result?.createUpsertParent.errors.length) {
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
    modal.open(ParentEdit, {
      ui: {
        width: 'w-full sm:max-w-4xl',
      },
      fullscreen: false,

      onInit: async () => {
        start()
        resetItem()
        const data = await parentService.edit(id)
        if (data.editParent) {
          item.value = data.editParent
        }
        await delay()
        finish()
        isReady.value = true
      },
      onSubmit: async (evt: FormSubmitEvent<Parent>) => {
        start()
        const result = await parentRepository.bulkCreateUpsert(toInput(evt.data))
        if (!result?.createUpsertParent.errors.length) {
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
    studentServiceGridConfig,
    gridToolbar,
    setGrid,
    handleRowSelect,
    handleRowDeselect,
    // State
    isReady,
    // Form
    item,
    validationSchema,
  }
})
