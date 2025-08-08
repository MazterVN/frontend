import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import { StudentCreate, StudentEdit, StudentExport } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type { CreateRelatedStudentInput, EditStudentQuery, StudentsCreateRelatedStudentImagesInput } from '#gql'
import { ContactType, AddressType, Gender } from '#gql/default'

export const useStudentStore = defineStore('studentStore', () => {
  // Types
  type Action = 'create' | 'update'
  type Student = At<EditStudentQuery, 'editStudent'>
  type StudentParent = At<EditStudentQuery, 'editStudent.studentParents'>
  type StudentContact = At<EditStudentQuery, 'editStudent.contacts'>
  type StudentRelative = At<EditStudentQuery, 'editStudent.studentRelatives'>
  type StudentAddress = At<EditStudentQuery, 'editStudent.studentAddresses'>
  type StudentImage = At<EditStudentQuery, 'editStudent.studentImages'>
  type ExportParams = {
    studyYearId: string
    serviceId: string
    serviceDetailId: string
  }

  // Store Dependencies
  const modal = useModalStore()
  const studentServiceStore = useStudentServiceStore()
  const { start, finish } = useLoadingIndicator()
  const { user } = useAuthentication()

  // State
  let grid: Grid | null = null
  const item = ref<Student>(initItem('create'))
  const studentImages = ref<FileMetadata[]>([])
  const selectedRecords = ref<Student[]>([])
  const exportParams = ref<ExportParams>(initExportParams(user.currentStudyYearId || ''))
  const isReady = ref(false)

  // Computed
  const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')
  const disabledExport = computed(() => {
    // Required to select service detail if no student is selected
    if (!selectedRecords.value.length && !exportParams.value.serviceDetailId) {
      return true
    }

    // Required to select service detail if service id is selected
    if (exportParams.value.serviceId) {
      return !exportParams.value.serviceDetailId
    }

    // Required all fields to export
    return !exportParams.value.studyYearId
  })

  // Validation Schema
  const validationSchema = v.object({
    id: v.pipe(v.string(), v.nonEmpty()),
    bookId: v.pipe(v.string('Please enter ID'), v.nonEmpty('Please enter ID')),
    name: v.pipe(v.string('Please enter name'), v.nonEmpty('Please enter name')),
    latin: v.pipe(v.string('Please enter latin'), v.nonEmpty('Please enter latin')),
    gender: v.pipe(v.string('Please select gender'), v.nonEmpty('Please select gender')),
    dob: v.pipe(v.string('Please enter date of birth'), v.nonEmpty('Please enter date of birth')),
    tel: v.pipe(v.string('Please enter tel'), v.nonEmpty('Please enter tel')),
    contacts: v.array(
      v.object({
        id: v.pipe(v.string(), v.nonEmpty()),
        type: v.pipe(v.string('Please select type'), v.nonEmpty('Please select type')),
        value: v.pipe(v.string('Please enter value'), v.nonEmpty('Please enter value')),
      }),
    ),
    studentRelatives: v.array(
      v.object({
        id: v.pipe(v.string(), v.nonEmpty()),
        relatedStudentId: v.pipe(v.string('Please select related student'), v.nonEmpty('Please select related student')),
        relativeId: v.pipe(v.string('Please select relative'), v.nonEmpty('Please select relative')),
      }),
    ),
    studentParents: v.array(
      v.object({
        id: v.pipe(v.string(), v.nonEmpty()),
        parentId: v.pipe(v.string('Please select parent'), v.nonEmpty('Please select parent')),
      }),
    ),
    studentAddresses: v.array(
      v.object({
        id: v.pipe(v.string(), v.nonEmpty()),
        type: v.pipe(v.string('Please select type'), v.nonEmpty('Please select type')),
        villageId: v.pipe(v.string('Please select address'), v.nonEmpty('Please select address')),
        studyYearId: v.pipe(v.string('Please select study year'), v.nonEmpty('Please select study year')),
      }),
    ),
    studentImages: v.array(
      v.object({
        id: v.pipe(v.string(), v.nonEmpty()),
        uri: v.pipe(v.string('Please select image'), v.nonEmpty('Please select image')),
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
      prefixIcon: 'icon-[lets-icons--export] !w-4 !h-4',
      id: 'export',
      click: () => openExportModal(),
    },
    'Search',
  ])

  const gridConfig = (): GridModel => ({
    ...globalGridConfig,
    dataSource: gridDataSource(ListStudentDocument),
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

  const studentServiceGridConfig = computed(() => ({
    ...globalGridConfig,
    height: 500,
    dataSource: gridDataSourceVars(ListStudentServiceByStudentDocument, { studentId: selectedRecordId.value }),
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
    groupSettings: { showDropArea: false, columns: ['studyYearLocalized.name'] },
  }))

  // Grid Methods
  function setGridRef(component: GridComponent | null): void {
    grid = component?.ej2Instances ?? null
  }

  function handleRowSelect(_args: RowSelectEventArgs): void {
    selectedRecords.value = (grid?.getSelectedRecords() || []) as Student[]
  }

  function handleRowDeselect(_args: RowDeselectEventArgs): void {
    selectedRecords.value = []
  }

  function refreshGrid() {
    grid?.refresh()
  }

  // Item Management Methods
  function initContact(type: ContactType): StudentContact {
    return {
      id: uuidv4(),
      type,
      value: '',
    }
  }

  function initStudentParent(): StudentParent {
    return {
      id: uuidv4(),
      parentId: '',
    }
  }

  function initStudentAddress(type: AddressType): StudentAddress {
    return {
      id: uuidv4(),
      type,
      villageId: '',
      studyYearId: '',
    }
  }

  function initRelative(): StudentRelative {
    return {
      id: uuidv4(),
      relatedStudentId: '',
      relativeId: '',
    }
  }
  function initExportParams(studyYearId: string): ExportParams {
    return {
      studyYearId: studyYearId,
      serviceId: '',
      serviceDetailId: '',
    }
  }
  function initItem(action: Action): Student {
    return {
      id: uuidv4(),
      bookId: '00000',
      name: '',
      latin: '',
      gender: Gender.MALE,
      dob: null,
      tel: '',
      contacts: [
        initContact(ContactType.TEL),
        initContact(ContactType.FACEBOOK),
        initContact(ContactType.LINE),
        initContact(ContactType.TELEGRAM),
      ],
      studentRelatives: [initRelative()],
      studentParents: action === 'create' ? [] : [initStudentParent()],
      studentAddresses: action === 'create' ? [] : [initStudentAddress(AddressType.CURRENT)],
      studentImages: [],
    }
  }

  function resetItem(action: Action) {
    item.value = initItem(action)
    studentImages.value = []
  }

  // Item Detail Management
  function addContact() {
    item.value.contacts.push(initContact(ContactType.TEL))
  }

  function removeContact(id: string) {
    item.value.contacts = item.value.contacts.filter(c => c.id !== id)
  }

  function addStudentParent() {
    item.value.studentParents.push(initStudentParent())
  }

  function removeStudentParent(id: string) {
    item.value.studentParents = item.value.studentParents.filter(p => p.id !== id)
  }

  function addStudentAddress() {
    item.value.studentAddresses.push(initStudentAddress(AddressType.CURRENT))
    item.value.studentAddresses.push(initStudentAddress(AddressType.POB))
  }

  function removeStudentAddress(id: string) {
    item.value.studentAddresses = item.value.studentAddresses.filter(a => a.id !== id)
  }

  function addRelative() {
    item.value.studentRelatives.push(initRelative())
  }

  function removeRelative(id: string) {
    item.value.studentRelatives = item.value.studentRelatives.filter(r => r.id !== id)
  }

  // Data Transformation
  function toImageInput(item: FileMetadata): StudentsCreateRelatedStudentImagesInput {
    return {
      id: item.id,
      uri: item.uri,
    }
  }

  function toFileMetadata(item: StudentImage): FileMetadata {
    const result = parseS3URI(item.uri ?? '')
    return {
      id: item.id,
      bucket: result?.bucket ?? '',
      key: result?.key ?? '',
      uri: item.uri ?? '',
    }
  }

  function toInput(item: Student): CreateRelatedStudentInput {
    return {
      id: item.id,
      bookId: item.bookId,
      name: item.name,
      latin: item.latin,
      gender: item.gender,
      dob: item.dob,
      tel: item.tel,
      contacts: item.contacts.map(c => ({
        id: c.id,
        type: c.type,
        value: c.value,
      })),
      studentRelatives: item.studentRelatives.map(r => ({
        id: r.id,
        relatedStudentId: r.relatedStudentId,
        relativeId: r.relativeId,
      })),
      studentParents: item.studentParents.map(p => ({
        id: p.id,
        parentId: p.parentId,
      })),
      studentAddresses: item.studentAddresses.map(a => ({
        id: a.id,
        type: a.type,
        villageId: a.villageId,
        studyYearId: a.studyYearId,
      })),
      studentImages: studentImages.value.map(toImageInput),
    }
  }

  // Modal Methods
  function openCreateModal() {
    isReady.value = false
    modal.open(StudentCreate, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-6xl',
      },

      onInit: async () => {
        resetItem('create')
        isReady.value = true
      },
      onSubmit: async (evt: FormSubmitEvent<Student>) => {
        start()
        const result = await studentRepository.createRelated(toInput(evt.data))
        if (!result?.createRelatedStudent.errors.length) {
          showSuccessToast('បន្ថែមបានជោគជ័យ')
          resetItem('create')
          refreshGrid()
        }
        await delay()
        finish()
      },
      onError: (_) => {
        showErrorToast('Validation error')
      },
      onClose: () => {

      },
    })
  }

  function openEditModal(id: string) {
    isReady.value = false
    modal.open(StudentEdit, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-6xl',
      },

      onInit: async () => {
        resetItem('update')
        start()
        const data = await studentRepository.edit(id)
        if (data?.editStudent) {
          item.value = data.editStudent
          studentImages.value = item.value.studentImages.map(toFileMetadata)
          // Make student can create inside Student
          studentServiceStore.setStudentId(item.value.id)
        }
        await delay()
        finish()
        isReady.value = true
      },
      onSubmit: async (evt: FormSubmitEvent<Student>) => {
        start()
        const result = await studentRepository.updateRelated(id, toInput(evt.data))
        if (result && !result?.updateRelatedStudent.errors.length) {
          showSuccessToast('កែប្រែបានជោគជ័យ')
          refreshGrid()
        }
        await delay()
        finish()
      },
      onClose: () => { },
    })
  }

  function openExportModal() {
    modal.open(StudentExport, {
      fullscreen: false,

      selectedCount: selectedRecords.value.length,
      ui: {
        width: 'w-full sm:max-w-2xl',
      },
      onInit: async () => {
        exportParams.value = initExportParams(user.currentStudyYearId || '')
      },
      onExport: async (evt: StudentExportCommand) => {
        start()
        const studentIds = exportParams.value.serviceDetailId ? [] : selectedRecords.value.map(s => s.id)
        const serviceDetailIds = exportParams.value.serviceDetailId ? [exportParams.value.serviceDetailId] : []
        switch (evt) {
          case 'student-card-66x97':
            await exportStudentCardSixSixByNineSevenMm(exportParams.value.studyYearId, serviceDetailIds, studentIds)
            break
          case 'student-card-54x85':
            await exportStudentCardFiveFourByEightyFiveMm(exportParams.value.studyYearId, serviceDetailIds, studentIds)
            break
          case 'new-student-info':
            await exportNewStudentInfo(exportParams.value.studyYearId, serviceDetailIds, studentIds)
            break
        }
        await delay()
        finish()
      },

    })
  }

  async function exportStudentCardSixSixByNineSevenMm(studyYearId: string, serviceDetailIds: string[], studentIds: string[]) {
    const data = await studentRepository.exportStudentCardSixSixByNineSevenMm(studyYearId, serviceDetailIds, studentIds)
    if (data?.exportStudentCardSixSixByNineSevenMm) {
      await downloadFile(data.exportStudentCardSixSixByNineSevenMm)
      showSuccessToast('បាននាំចេញជោគជ័យ')
    }
  }

  async function exportStudentCardFiveFourByEightyFiveMm(studyYearId: string, serviceDetailIds: string[], studentIds: string[]) {
    const data = await studentRepository.exportStudentCardFiveFourByEightyFiveMm(studyYearId, serviceDetailIds, studentIds)
    if (data?.exportStudentCardFiveFourByEightyFiveMm) {
      await downloadFile(data.exportStudentCardFiveFourByEightyFiveMm)
      showSuccessToast('បាននាំចេញជោគជ័យ')
    }
  }

  async function exportNewStudentInfo(studyYearId: string, serviceDetailIds: string[], studentIds: string[]) {
    const data = await studentRepository.exportNewStudentInfo(studyYearId, serviceDetailIds, studentIds)
    if (data?.exportNewStudentInfo) {
      await downloadFile(data.exportNewStudentInfo)
      showSuccessToast('បាននាំចេញជោគជ័យ')
    }
  }

  // Public API
  return {
    // Grid
    gridConfig,
    studentServiceGridConfig,
    gridToolbar,
    setGridRef,
    handleRowSelect,
    handleRowDeselect,

    // Form
    item,
    studentImages,
    validationSchema,

    // State
    exportParams,
    disabledExport,
    // Item Management
    addContact,
    removeContact,
    addRelative,
    removeRelative,
    addStudentParent,
    removeStudentParent,
    addStudentAddress,
    removeStudentAddress,
  }
})
