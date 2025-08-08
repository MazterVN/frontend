import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import type { ChangeEventArgs } from '@syncfusion/ej2-vue-dropdowns'
import { enrollmentRepository } from './enrollmentRepository'
import type { CreateRelatedEnrollmentInput, EditEnrollmentQuery } from '#gql'
import { BaseFilemanager, EnrollmentCreate, EnrollmentEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  AddressType,
  EnrollmentStateType,
  Gender,
  ParentType,
  AttachmentType,
  AttachmentNamespace,
  ParentJob,
} from '#gql/default'

export const useEnrollmentStore = defineStore('enrollmentStore', () => {
// Types
type Enrollment = At<EditEnrollmentQuery, 'editEnrollment'>
type EnrollmentStudentDraft = At<Enrollment, 'enrollmentStudentDrafts'>
type EnrollmentAddressDraft = At<Enrollment, 'enrollmentAddressDrafts'>
type EnrollmentParentDraft = At<Enrollment, 'enrollmentParentDrafts'>
type EnrollmentPaymentAttachment = At<Enrollment, 'enrollmentPaymentAttachments'>
// Store Dependencies
const modal = useModalStore()
const { start, finish } = useLoadingIndicator()
const { user } = useAuthentication()

// State
let grid: Grid | null = null
const item = ref<Enrollment>(initItem())
const selectedRecords = ref<Enrollment[]>([])
const isReady = ref(false)

// Computed
const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')

// Validation Schema
const validationSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  state: v.pipe(v.string('Please select state'), v.nonEmpty('Please select state')),
  enrollmentSettingDestinationId: v.pipe(v.string('Please select destination'), v.nonEmpty('Please select destination')),
  buildingRoomSeatId: v.nullable(v.string('Please select seat')),
  studentServiceId: v.pipe(v.string('Please select student service'), v.nonEmpty('Please select student service')),
  sourceStudyYearId: v.pipe(v.string('Please select source study year'), v.nonEmpty('Please select source study year')),
  destinationStudyYearId: v.pipe(v.string('Please select destination study year'), v.nonEmpty('Please select destination study year')),
  enrollmentStudentDrafts: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      name: v.pipe(v.string('Please enter name'), v.nonEmpty('Please enter name')),
      nameEditable: v.boolean(),
      latin: v.pipe(v.string('Please enter latin name'), v.nonEmpty('Please enter latin name')),
      latinEditable: v.boolean(),
      dob: v.pipe(v.string('Please enter date of birth'), v.nonEmpty('Please enter date of birth')),
      dobEditable: v.boolean(),
      gender: v.pipe(v.string('Please select gender'), v.nonEmpty('Please select gender')),
      genderEditable: v.boolean(),
      tel: v.pipe(v.string('Please enter telephone'), v.nonEmpty('Please enter telephone')),
      telEditable: v.boolean(),
      email: v.nullable(v.string('Please enter email')),
      emailEditable: v.boolean(),
      facebook: v.nullable(v.string('Please enter facebook')),
      facebookEditable: v.boolean(),
      lineId: v.nullable(v.string('Please enter line ID')),
      lineIdEditable: v.boolean(),
    }),
  ),
  enrollmentAddressDrafts: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      type: v.pipe(v.string('Please select type'), v.nonEmpty('Please select type')),
      villageId: v.pipe(v.string('Please select village'), v.nonEmpty('Please select village')),
      villageIdEditable: v.boolean(),
    }),
  ),
  enrollmentParentDrafts: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      name: v.pipe(v.string('Please enter name'), v.nonEmpty('Please enter name')),
      nameEditable: v.boolean(),
      latin: v.pipe(v.string('Please enter latin name'), v.nonEmpty('Please enter latin name')),
      latinEditable: v.boolean(),
      job: v.pipe(v.string('Please enter job'), v.nonEmpty('Please enter job')),
      jobEditable: v.boolean(),
      tel: v.pipe(v.string('Please enter telephone'), v.nonEmpty('Please enter telephone')),
      telEditable: v.boolean(),
      type: v.pipe(v.string('Please select type'), v.nonEmpty('Please select type')),
      typeEditable: v.boolean(),
    }),
  ),
  enrollmentPaymentAttachments: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      bucket: v.pipe(v.string('Please enter bucket'), v.nonEmpty('Please enter bucket')),
      key: v.pipe(v.string('Please enter key'), v.nonEmpty('Please enter key')),
      type: v.pipe(v.string('Please select type'), v.nonEmpty('Please select type')),
      namespace: v.pipe(v.string('Please enter namespace'), v.nonEmpty('Please enter namespace')),
      note: v.nullable(v.string()),
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
  dataSource: gridDataSource(ListEnrollmentDocument),
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
  selectedRecords.value = (grid?.getSelectedRecords() || []) as Enrollment[]
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
function initStudentDraft(): EnrollmentStudentDraft {
  return {
    id: uuidv4(),
    name: '',
    nameEditable: true,
    latin: '',
    latinEditable: true,
    dob: '',
    dobEditable: true,
    gender: Gender.MALE,
    genderEditable: true,
    tel: '',
    telEditable: true,
    email: '',
    emailEditable: true,
    facebook: '',
    facebookEditable: true,
    lineId: '',
    lineIdEditable: true,
  }
}

function initAddressDraft(type: AddressType): EnrollmentAddressDraft {
  return {
    id: uuidv4(),
    type: type,
    villageId: '',
    villageIdEditable: true,
  }
}

function initParentDraft(): EnrollmentParentDraft {
  return {
    id: uuidv4(),
    name: '',
    nameEditable: true,
    latin: '',
    latinEditable: true,
    job: ParentJob.UNKNOWN,
    jobEditable: true,
    tel: '',
    telEditable: true,
    type: ParentType.FATHER,
    typeEditable: true,
  }
}

function initPaymentAttachment(): EnrollmentPaymentAttachment {
  return {
    id: uuidv4(),
    bucket: '',
    key: '',
    type: AttachmentType.OTHER,
    namespace: AttachmentNamespace.ALL,
    note: '',
  } as const
}

function initItem(): Enrollment {
  return {
    id: uuidv4(),
    state: EnrollmentStateType.PENDING,
    enrollmentSettingDestinationId: '',
    buildingRoomSeatId: '',
    studentServiceId: '',
    sourceStudyYearId: '',
    destinationStudyYearId: '',
    enrollmentStudentDrafts: [initStudentDraft()],
    enrollmentAddressDrafts: [initAddressDraft(AddressType.CURRENT), initAddressDraft(AddressType.POB)],
    enrollmentParentDrafts: [initParentDraft()],
    enrollmentPaymentAttachments: [initPaymentAttachment()],
  }
}

function resetItem() {
  item.value = initItem()
}

// TODO: 1
async function studentServiceIdChanged(args: ChangeEventArgs) {
  start()
  const studentServiceId = args.value as string
  const result = await studentServiceRepository.fillEnrollmentDraft(studentServiceId)
  if (result?.studentServiceFillEnrollmentDraft) {
    const data = result.studentServiceFillEnrollmentDraft
    item.value.enrollmentStudentDrafts = data.students as EnrollmentStudentDraft[]
    item.value.enrollmentAddressDrafts = data.addresses as EnrollmentAddressDraft[]
    item.value.enrollmentParentDrafts = data.parents as EnrollmentParentDraft[]
  }
  item.value.enrollmentSettingDestinationId = ''
  await delay()
  finish()
}

function addStudentDraft() {
  item.value.enrollmentStudentDrafts.push(initStudentDraft())
}

function addAddressDraft() {
  item.value.enrollmentAddressDrafts.push(initAddressDraft(AddressType.CURRENT))
  item.value.enrollmentAddressDrafts.push(initAddressDraft(AddressType.POB))
}

function addParentDraft() {
  item.value.enrollmentParentDrafts.push(initParentDraft())
}

function addPaymentAttachment() {
  item.value.enrollmentPaymentAttachments.push(initPaymentAttachment())
}

function removeStudentDraft(id: string) {
  item.value.enrollmentStudentDrafts = item.value.enrollmentStudentDrafts.filter(draft => draft.id !== id)
}

function removeAddressDraft(id: string) {
  item.value.enrollmentAddressDrafts = item.value.enrollmentAddressDrafts.filter(draft => draft.id !== id)
}

function removeParentDraft(id: string) {
  item.value.enrollmentParentDrafts = item.value.enrollmentParentDrafts.filter(draft => draft.id !== id)
}

function removePaymentAttachment(id: string) {
  item.value.enrollmentPaymentAttachments = item.value.enrollmentPaymentAttachments.filter(attachment => attachment.id !== id)
}

function attachFile(id: string) {
  // Find index of attachment to update
  const index = item.value.enrollmentPaymentAttachments.findIndex(a => a.id === id)
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
      item.value.enrollmentPaymentAttachments[index] = {
        ...item.value.enrollmentPaymentAttachments[index] as EnrollmentPaymentAttachment,
        bucket: files[0]?.bucket ?? '',
        key: files[0]?.key ?? '',
      }
    },
  })
}

// Modal Methods
function openCreateModal() {
  isReady.value = false
  modal.open(EnrollmentCreate, {
    ui: {
      width: 'w-full sm:max-w-6xl',
    },
    fullscreen: false,

    onInit: async () => {
      resetItem()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<Enrollment>) => {
      start()
      const result = await enrollmentRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedEnrollment.errors.length) {
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
  modal.open(EnrollmentEdit, {
    ui: {
      width: 'w-full sm:max-w-6xl',
    },
    fullscreen: false,

    onInit: async () => {
      start()
      resetItem()
      const data = await enrollmentRepository.edit(id)
      if (data?.editEnrollment) {
        item.value = data.editEnrollment
      }
      await delay()
      finish()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<Enrollment>) => {
      start()
      const result = await enrollmentRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedEnrollment.errors.length) {
        showSuccessToast('កែប្រែបានជោគជ័យ')
        refreshGrid()
      }
      await delay()
      finish()
    },
    onError: (error: FormError) => showErrorToast(error),

  })
}

// Data Transformation
function toInput(data: Enrollment): CreateRelatedEnrollmentInput {
  return {
    id: data.id,
    state: data.state,
    enrollmentSettingDestinationId: data.enrollmentSettingDestinationId,
    buildingRoomSeatId: data.buildingRoomSeatId,
    studentServiceId: data.studentServiceId,
    sourceStudyYearId: data.sourceStudyYearId,
    destinationStudyYearId: data.destinationStudyYearId,
    enrollmentStudentDrafts: data.enrollmentStudentDrafts,
    enrollmentAddressDrafts: data.enrollmentAddressDrafts,
    enrollmentParentDrafts: data.enrollmentParentDrafts,
    enrollmentPaymentAttachments: data.enrollmentPaymentAttachments,
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
  // State
  isReady,
  // Form
  item,
  validationSchema,
  // Draft Management
  studentServiceIdChanged,
  addStudentDraft,
  addAddressDraft,
  addParentDraft,
  addPaymentAttachment,
  removeStudentDraft,
  removeAddressDraft,
  removeParentDraft,
  removePaymentAttachment,
  attachFile,
}
})
