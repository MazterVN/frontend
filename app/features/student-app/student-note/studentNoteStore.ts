import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import { studentNoteRepository } from './studentNoteRepository'
import type { CreateRelatedStudentNoteInput, EditStudentNoteQuery } from '#gql'
import { BaseFilemanager, StudentNoteCreate, StudentNoteEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import { AttachmentNamespace, AttachmentType } from '#gql/default'

export const useStudentNoteStore = defineStore('studentNoteStore', () => {
// Types
type StudentNote = At<EditStudentNoteQuery, 'editStudentNote'>
type StudentNoteAttachment = At<StudentNote, 'attachments'>

// Store Dependencies
const modal = useModalStore()
const { start, finish } = useLoadingIndicator()
const { user } = useAuthentication()

// State
let grid: Grid | null = null
const item = ref<StudentNote>(initItem())
const selectedRecords = ref<StudentNote[]>([])
const isReady = ref(false)

// Computed
const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')

// Validation Schema
const validationSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  title: v.pipe(v.string('Please enter a title'), v.nonEmpty('Please enter a title')),
  note: v.pipe(v.string('Please enter a note'), v.nonEmpty('Please enter a note')),
  noteAt: v.pipe(v.string('Please select date'), v.nonEmpty('Please select date')),
  attachments: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      bucket: v.pipe(v.string(), v.nonEmpty()),
      key: v.pipe(v.string(), v.nonEmpty()),
      type: v.pipe(v.string(), v.nonEmpty()),
      namespace: v.pipe(v.string(), v.nonEmpty()),
    }),
  ),
  studentNoteStudentServices: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      studentServiceId: v.pipe(v.string('Please select student service'), v.nonEmpty('Please select student service')),
    }),
  ),
  studentNoteStudentParents: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      studentParentId: v.pipe(v.string('Please select student parent'), v.nonEmpty('Please select student parent')),
    }),
  ),
  studentNoteEmployees: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      employeeId: v.pipe(v.string('Please select employee'), v.nonEmpty('Please select employee')),
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
  dataSource: gridDataSource(ListStudentNoteDocument),
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
  selectedRecords.value = (grid?.getSelectedRecords() || []) as StudentNote[]
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
function initItem(): StudentNote {
  return {
    id: uuidv4(),
    title: '',
    note: '',
    noteAt: '',
    attachments: [],
    studentNoteStudentServices: [],
    studentNoteStudentParents: [],
    studentNoteEmployees: [],
  }
}

function initAttachment(): StudentNoteAttachment {
  return {
    id: uuidv4(),
    bucket: '',
    key: '',
    type: AttachmentType.OTHER,
    namespace: AttachmentNamespace.ALL,
  }
}

function resetItem() {
  item.value = initItem()
}

function addStudentService() {
  item.value.studentNoteStudentServices.push({
    id: uuidv4(),
    studentServiceId: '',
  })
}

function removeStudentService(id: string) {
  item.value.studentNoteStudentServices = item.value.studentNoteStudentServices.filter(service => service.id !== id)
}

function addStudentParent() {
  item.value.studentNoteStudentParents.push({
    id: uuidv4(),
    studentParentId: '',
  })
}

function removeStudentParent(id: string) {
  item.value.studentNoteStudentParents = item.value.studentNoteStudentParents.filter(parent => parent.id !== id)
}

function addEmployee() {
  item.value.studentNoteEmployees.push({
    id: uuidv4(),
    employeeId: '',
  })
}

function removeEmployee(id: string) {
  item.value.studentNoteEmployees = item.value.studentNoteEmployees.filter(employee => employee.id !== id)
}
// TODO: 1
function attachFile(id: string) {
  // Find index of attachment to update
  const index = item.value.attachments.findIndex(a => a.id === id)
  if (index === -1) return

  // Open file manager modal
  modal.open(BaseFilemanager, {
    fullscreen: false,
    namespace: AttachmentNamespace.ALL,
    picker: true,
    key: 'imagePickerKey',
    bucket: user.bucket ?? '',
    bucketFolder: user.bucketFolder ?? '',
    allowedExtensions: '.jpg,.jpeg,.png,.pdf,.doc,.docx',
    ui: {
      width: 'w-full sm:max-w-6xl',
    },

    onChoose: (files: FileMetadata[]) => {
      // Directly update the attachment in the array
      //
      item.value.attachments[index] = {
        ...item.value.attachments[index] as StudentNoteAttachment,
        bucket: files[0]?.bucket ?? '',
        key: files[0]?.key ?? '',
      }
    },
  })
}

function addAttachment() {
  item.value.attachments.push(initAttachment())
}
function removeAttachment(id: string) {
  item.value.attachments = item.value.attachments.filter(attachment => attachment.id !== id)
}

// Data Transformation
function toInput(data: StudentNote): CreateRelatedStudentNoteInput {
  return {
    id: data.id,
    title: data.title,
    note: data.note,
    noteAt: data.noteAt,
    attachments: data.attachments,
    studentNoteStudentServices: data.studentNoteStudentServices,
    studentNoteStudentParents: data.studentNoteStudentParents,
    studentNoteEmployees: data.studentNoteEmployees,
  }
}

// Modal Methods
function openCreateModal() {
  isReady.value = false
  modal.open(StudentNoteCreate, {
    ui: {
      width: 'w-full sm:max-w-full mx-2',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<StudentNote>) => {
      isReady.value = false
      start()
      const result = await studentNoteRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedStudentNote.errors.length) {
        showSuccessToast('បន្ថែមបានជោគជ័យ')
        resetItem()
        refreshGrid()
      }
      await delay(1000)
      finish()
      isReady.value = true
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

function openEditModal(id: string) {
  isReady.value = false
  modal.open(StudentNoteEdit, {
    ui: {
      width: 'w-full sm:max-w-full mx-2',
    },
    fullscreen: false,

    onInit: async () => {
      start()
      resetItem()
      const data = await studentNoteRepository.edit(id)
      if (data?.editStudentNote) {
        item.value = data.editStudentNote
      }
      await delay(1000)
      finish()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<StudentNote>) => {
      start()
      const result = await studentNoteRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedStudentNote.errors.length) {
        showSuccessToast('កែប្រែបានជោគជ័យ')
        refreshGrid()
      }
      await delay(1000)
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
  openEditModal,
  // State
  isReady,
  // Form
  item,
  validationSchema,
  attachFile,
  addAttachment,
  removeAttachment,
  addStudentService,
  removeStudentService,
  addStudentParent,
  removeStudentParent,
  addEmployee,
  removeEmployee,
}
})
