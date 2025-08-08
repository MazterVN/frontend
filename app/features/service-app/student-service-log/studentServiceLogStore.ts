import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import { v4 as uuidv4 } from 'uuid'
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import { StudentServiceLogCreate, StudentServiceLogEdit } from '#components'
import {
  ServiceLogType,
  type CreateRelatedUpsertStudentServiceLogInput,
  type EditStudentServiceLogQuery,
} from '#gql/default'

export const useStudentServiceLogStore = defineStore('studentStudentServiceLogStore', () => {
  // Types
  type StudentServiceLog = At<EditStudentServiceLogQuery, 'editStudentServiceLog'>
  type StudentServiceLogReason = At<EditStudentServiceLogQuery, 'editStudentServiceLog.reasons'>

  // Store Dependencies
  const modal = useModalStore()

  // State
  let grid: Grid | null = null
  const studentServiceId = ref('')
  const item = ref<StudentServiceLog>(initItem(ServiceLogType.REGISTER))
  const selectedRecords = ref<StudentServiceLog[]>([])

  // Computed
  const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')

  // Validation Schema
  const validationSchema = v.object({
    id: v.pipe(v.string(), v.nonEmpty()),
    date: v.pipe(
      v.string('Please select a date'),
      v.nonEmpty('Please select a date'),
    ),
    type: v.pipe(
      v.string('Please select a type'),
      v.nonEmpty('Please select a type'),
    ),
    reasons: v.array(
      v.object({
        id: v.pipe(v.string(), v.nonEmpty()),
        dropReasonId: v.nullable(v.string('Please select a drop reason')),
        registerReasonId: v.nullable(v.string('Please select a register reason')),
      }),
    ),
  })

  // Grid Toolbar
  const gridToolbar = computed(() => [
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
  ])

  // Grid Configuration
  const gridConfig = (studentServiceId: string): GridModel => ({
    ...globalGridConfig,
    dataSource: gridDataSourceVars(ListStudentServiceLogDocument, { studentServiceId }),
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
    allowGrouping: true,
    selectionSettings: {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    },
    groupSettings: { showDropArea: false, columns: ['typeValue'] },
    sortSettings: {
      columns: [
        {
          field: 'date',
          direction: 'Ascending',
        },
        { field: 'typeValue', direction: 'Ascending' },
      ],
    },
  })

  // Grid Methods
  const setGridRef = (component: GridComponent | null): void => {
    grid = component?.ej2Instances ? component?.ej2Instances : null
  }

  function refreshGrid() {
    grid?.refresh()
  }

  function handleRowSelect(_args: RowSelectEventArgs): void {
    selectedRecords.value = (grid?.getSelectedRecords() || []) as StudentServiceLog[]
  }

  function handleRowDeselect(_args: RowDeselectEventArgs): void {
    selectedRecords.value = []
  }

  // Item Management Methods
  function initItemReason(): StudentServiceLogReason {
    return {
      id: uuidv4(),
      dropReasonId: null,
      registerReasonId: null,
    }
  }

  function initItem(type: ServiceLogType): StudentServiceLog {
    return {
      id: uuidv4(),
      date: null,
      type: type,
      studentServiceId: studentServiceId.value,
      reasons: [initItemReason()],
    }
  }

  function resetItem() {
    item.value = initItem(ServiceLogType.REGISTER)
  }

  function addReason() {
    item.value.reasons.push(initItemReason())
  }

  function removeReason(id: string) {
    item.value.reasons = item.value.reasons.filter(reason => reason.id !== id)
  }

  // Data Transformation
  function toInput(item: StudentServiceLog): CreateRelatedUpsertStudentServiceLogInput {
    return {
      id: item.id,
      date: item.date,
      type: item.type,
      studentServiceId: studentServiceId.value,
      reasons: item.reasons.map(reason => ({
        id: reason.id,
        dropReasonId: reason.dropReasonId,
        registerReasonId: reason.registerReasonId,
      })),
    }
  }

  // Modal Methods
  function openCreateModal() {
    modal.open(StudentServiceLogCreate, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-2xl',
      },

      onInit: async () => {
        resetItem()
      },
      onSubmit: async (evt: FormSubmitEvent<StudentServiceLog>) => {
        const result = await studentServiceLogRepository.createRelatedUpsert(toInput(evt.data))
        if (result && !result?.createRelatedUpsertStudentServiceLog.errors.length) {
          showSuccessToast('បន្ថែមបានជោគជ័យ')
          resetItem()
          refreshGrid()
        }
      },
      onClose: () => {

      },
    })
  }

  function openEditModal(id: string) {
    modal.open(StudentServiceLogEdit, {
      fullscreen: false,

      ui: {
        width: 'w-full sm:max-w-2xl',
      },
      onInit: async () => {
        resetItem()
        const result = await studentServiceLogRepository.edit(id)
        if (result?.editStudentServiceLog) {
          item.value = result.editStudentServiceLog
        }
      },
      onSubmit: async (evt: FormSubmitEvent<StudentServiceLog>) => {
        const result = await studentServiceLogRepository.createRelatedUpsert(toInput(evt.data))
        if (result && !result?.createRelatedUpsertStudentServiceLog.errors.length) {
          showSuccessToast('កែប្រែបានជោគជ័យ')
          refreshGrid()
        }
      },
      onClose: () => {

      },
    })
  }

  // State Management
  function setStudentServiceId(id: string) {
    studentServiceId.value = id
  }

  // Public API
  return {
    // Grid
    gridConfig,
    setGridRef,
    handleRowSelect,
    handleRowDeselect,
    gridToolbar,

    // Form
    item,
    validationSchema,
    addReason,
    removeReason,

    // State Management
    setStudentServiceId,
    selectedRecords,
    selectedRecordId,
  }
})
