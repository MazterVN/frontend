import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import { v4 as uuidv4 } from 'uuid'
import * as v from 'valibot'
import type { FormSubmitEvent } from '#ui/types'
import { StudentServiceBatchUpgrade, StudentServiceCreate, StudentServiceEdit, StudentServiceExport, StudentServiceTransfer } from '#components'
import {
  ShiftType,
  type BatchUpgradeStudentServiceInput,
  type CreateStudentServiceTransferInput,
  type CreateUpsertStudentServiceInput,
  type EditStudentServiceQuery,
} from '#gql/default'

export const useStudentServiceStore = defineStore('studentStudentServiceStore', () => {
  // Types
  type StudentService = At<EditStudentServiceQuery, 'editStudentService'>

  type ExportParams = {
    studyYearId: string
    serviceId: string
    serviceDetailId: string
  }

  // Store Dependencies
  const modal = useModalStore()
  const logStore = useStudentServiceLogStore()
  const { user } = useAuthentication()

  // State
  let grid: Grid | null = null
  const item = ref<StudentService>(initItem(''))
  const transferItem = ref<CreateStudentServiceTransferInput>(initTransferInput(''))
  const batchUpgradeItem = ref<BatchUpgradeStudentServiceInput>(initBatchUpgradeInput([]))
  const exportParams = ref<ExportParams>(initExportParams(user.currentStudyYearId || ''))
  const selectedRecords = ref<StudentService[]>([])
  const studentId = ref('')

  // Computed
  const selectedRecord = computed<StudentService>(() => selectedRecords.value?.[0] ?? initItem(''))
  const selectedRecordId = computed<string>(() => selectedRecord.value.id)
  const selectedRecordIds = computed<string[]>(() => selectedRecords.value.map(s => s.id))
  const logStoreGridConfig = computed(() => logStore.gridConfig(selectedRecordId.value))

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

  // Loading Indicator
  const { start, finish } = useLoadingIndicator()

  // Validation Schema

  const batchUpgradeValidationSchema = v.object({
    note: v.pipe(v.string('Please enter a note'), v.nonEmpty('Please enter a note')),
    serviceDetailId: v.pipe(v.string('Please select a service'), v.nonEmpty('Please select a service')),
    serviceTypeId: v.pipe(v.string('Please select a service type'), v.nonEmpty('Please select a service type')),
    shiftType: v.pipe(v.string('Please select a shift type'), v.nonEmpty('Please select a shift type')),
    studentServiceIds: v.array(v.pipe(v.string('Please select a student'), v.nonEmpty('Please select a student'))),
    studyYearId: v.pipe(v.string('Please select a study year'), v.nonEmpty('Please select a study year')),
  })
  const transferValidationSchema = v.object({
    fromId: v.pipe(v.string(), v.nonEmpty()),
    serviceDetailId: v.pipe(v.string('Please select a service'), v.nonEmpty('Please select a service')),
    transferDate: v.pipe(v.string('Please select a transfer date'), v.nonEmpty('Please select a transfer date')),
  })
  const validationSchema = v.object({
    id: v.pipe(v.string(), v.nonEmpty()),
    isActive: v.boolean('Is Active must be a boolean'),
    studyYearId: v.pipe(
      v.string('Please select a study year'),
      v.nonEmpty('Please select a study year'),
    ),
    studentId: v.pipe(
      v.string('Please enter a student'),
      v.nonEmpty('Please enter a student'),
    ),
    serviceDetail: v.object({
      serviceId: v.pipe(
        v.string('Please select a service'),
        v.nonEmpty('Please select a service'),
      ),
    }),
    serviceDetailId: v.pipe(
      v.string('Please select a service detail'),
      v.nonEmpty('Please select a service detail'),
    ),
    serviceTypeId: v.pipe(
      v.string('Please select a service type'),
      v.nonEmpty('Please select a service type'),
    ),
    shiftType: v.pipe(
      v.string('Please select a shift type'),
      v.nonEmpty('Please select a shift type'),
    ),
    note: v.string('Please enter a note'),
  })

  // Grid Methods
  const setGridRef = (component: GridComponent | null): void => {
    grid = component?.ej2Instances ? component?.ej2Instances : null
  }

  function refreshGrid() {
    grid?.refresh()
  }

  // Item Management Methods
  function setStudentId(id: string) {
    studentId.value = id
  }

  function initExportParams(studyYearId: string): ExportParams {
    return {
      studyYearId: studyYearId,
      serviceId: '',
      serviceDetailId: '',
    }
  }

  function initItem(studentId: string): StudentService {
    return {
      id: uuidv4(),
      isActive: true,
      studentId: studentId,
      studyYearId: '',
      serviceDetail: {
        serviceId: '',
      },
      serviceDetailId: '',
      serviceTypeId: '',
      shiftType: ShiftType.FULLTIME,
      note: '',
      allowEdit: true,
    }
  }

  function initTransferInput(fromId: string): CreateStudentServiceTransferInput {
    return {
      fromId: fromId,
      serviceDetailId: '',
      transferDate: '',
    }
  }

  function initBatchUpgradeInput(studentServiceIds: string[]): BatchUpgradeStudentServiceInput {
    return {
      studentServiceIds: studentServiceIds,
      note: '',
      serviceDetailId: '',
      serviceTypeId: '',
      shiftType: ShiftType.FULLTIME,
      studyYearId: '',
    }
  }

  function resetItem(studentId: string): void {
    item.value = initItem(studentId)
  }

  function resetTransferItem(fromId: string): void {
    transferItem.value = initTransferInput(fromId)
  }

  function resetBatchUpgradeItem(studentServiceIds: string[]): void {
    batchUpgradeItem.value = initBatchUpgradeInput(studentServiceIds)
  }

  // Data Transformation
  function toInput(item: StudentService): CreateUpsertStudentServiceInput {
    return {
      id: item.id,
      isActive: item.isActive,
      studentId: item.studentId,
      studyYearId: item.studyYearId,
      serviceDetailId: item.serviceDetailId,
      serviceTypeId: item.serviceTypeId,
      shiftType: item.shiftType,
      note: item.note,
    }
  }

  // TODO: 1
  // Export Methods
  async function exportNewStudentList(studentServiceIds: string[], serviceDetailIds: string[]) {
    start()
    const data = await studentServiceRepository.exportNewStudentList(studentServiceIds, serviceDetailIds)
    if (data?.exportNewStudentList) {
      await downloadFile(data.exportNewStudentList)
      showSuccessToast('បាននាំចេញជោគជ័យ')
    }
    await delay()
    finish()
  }

  async function exportBioCheckList(studyYearId: string, serviceDetailIds: string[], studentServiceIds: string[]) {
    start()
    const data = await studentServiceRepository.exportBioCheckList(studyYearId, serviceDetailIds, studentServiceIds)
    if (data?.exportBioCheckList) {
      await downloadFile(data.exportBioCheckList)
      showSuccessToast('បាននាំចេញជោគជ័យ')
    }
    await delay()
    finish()
  }

  async function exportCertificateOfEducation(studyYearId: string, serviceDetailIds: string[], studentServiceIds: string[]) {
    start()
    const data = await studentServiceRepository.exportCertificateOfEducation(studyYearId, serviceDetailIds, studentServiceIds)
    if (data?.exportCertificateOfEducation) {
      await downloadFile(data.exportCertificateOfEducation)
      showSuccessToast('បាននាំចេញជោគជ័យ')
    }
    await delay()
    finish()
  }

  async function exportStudentProfile(serviceDetailIds: string[], studentServiceIds: string[]) {
    start()
    if (!user.telegramChatId) {
      showErrorToast('សូមធ្វើការភ្ជាប់ជាមួយ telegram bot ជាមុនសិន។ Go to -> Profile -> Connect with Telegram')
      return
    }
    const data = await studentServiceRepository.exportStudentProfile(serviceDetailIds, studentServiceIds)
    if (data?.studentServiceExportStudentProfile) {
      showSuccessToast('សូមរងចាំក្នុង Telegeram')
    }
    await delay()
    finish()
  }

  // Modal Methods
  function openCreateModal() {
    modal.open(StudentServiceCreate, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-6xl',
      },

      onInit: async () => {
        resetItem(studentId.value)
      },
      onSubmit: async (evt: FormSubmitEvent<StudentService>) => {
        const result = await studentServiceRepository.createUpsert(toInput(evt.data))
        if (result && !result?.createUpsertStudentService.errors.length) {
          showSuccessToast('បន្ថែមបានជោគជ័យ')
          resetItem(studentId.value)
          refreshGrid()
        }
      },
      onError: (_) => {
        showErrorToast('Validation error')
      },
      onClose: () => {

      },
    })
  }

  function openEditModal(id: string) {
    modal.open(StudentServiceEdit, {
      fullscreen: false,

      ui: {
        width: 'w-full sm:max-w-6xl',
      },
      onInit: async () => {
        resetItem(studentId.value)
        const result = await studentServiceRepository.edit(id)
        if (result?.editStudentService) {
          item.value = result.editStudentService
          logStore.setStudentServiceId(item.value.id)
        }
      },
      onSubmit: async (evt: FormSubmitEvent<StudentService>) => {
        const result = await studentServiceRepository.createUpsert(toInput(evt.data))
        if (result && !result?.createUpsertStudentService.errors.length) {
          showSuccessToast('កែប្រែបានជោគជ័យ')
          refreshGrid()
        }
      },
      onError: (_) => {
        showErrorToast('Validation error')
      },
      onClose: () => {

      },
    })
  }

  function openExportModal() {
    modal.open(StudentServiceExport, {
      fullscreen: false,

      selectedCount: selectedRecords.value.length,
      ui: {
        width: 'w-full sm:max-w-2xl',
      },
      onInit: async () => {
        exportParams.value = initExportParams(user.currentStudyYearId || '')
      },
      onExport: async (evt: StudentServiceExportCommand) => {
        const studentServiceIds = exportParams.value.serviceDetailId ? [] : selectedRecords.value.map(s => s.id)
        const serviceDetailIds = exportParams.value.serviceDetailId ? [exportParams.value.serviceDetailId] : []
        start()
        switch (evt) {
          case 'new-student-list':
            await exportNewStudentList(studentServiceIds, serviceDetailIds)
            break
          case 'bio-check-list':
            await exportBioCheckList(exportParams.value.studyYearId, serviceDetailIds, studentServiceIds)
            break
          case 'certificate-of-education':
            await exportCertificateOfEducation(exportParams.value.studyYearId, serviceDetailIds, studentServiceIds)
            break
          case 'student-profile':
            await exportStudentProfile(serviceDetailIds, studentServiceIds)
            break
          default:
            break
        }
        finish()
      },
      onClose: () => {

      },
    })
  }

  function openTransferModal(fromId: string) {
    modal.open(StudentServiceTransfer, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-6xl',
      },

      onInit: async () => {
        resetTransferItem(fromId)
      },
      onSubmit: async (evt: FormSubmitEvent<CreateStudentServiceTransferInput>) => {
        const data = await studentServiceRepository.createTransfer(evt.data)
        if (data?.createStudentServiceTransfer) {
          showSuccessToast('ប្តូរសេវាកម្មបានជោគជ័យ')
          resetTransferItem('')
          refreshGrid()
        }
      },
      onError: (error: FormError) => showErrorToast(error),

    })
  }

  function openBatchUpgradeModal(studentServiceIds: string[]) {
    modal.open(StudentServiceBatchUpgrade, {
      fullscreen: false,
      ui: {
        width: 'w-full sm:max-w-6xl',
      },

      onInit: async () => {
        resetBatchUpgradeItem(studentServiceIds)
      },
      onSubmit: async (evt: FormSubmitEvent<BatchUpgradeStudentServiceInput>) => {
        const data = await studentServiceRepository.batchUpgrade(evt.data)
        if (data?.batchUpgradeStudentService) {
          showSuccessToast('ប្តូរសេវាកម្មបានជោគជ័យ')
          resetBatchUpgradeItem([])
          refreshGrid()
        }
      },
      onError: (error: FormError) => showErrorToast(error),

    })
  }

  // Event Handlers
  function handleRowSelect(_args: RowSelectEventArgs): void {
    selectedRecords.value = (grid?.getSelectedRecords() || []) as StudentService[]
  }

  function handleRowDeselect(_args: RowDeselectEventArgs): void {
    selectedRecords.value = []
  }

  // Grid Configuration
  const gridToolbar = computed<ToolbarItemType[]>(() => [
    {
      text: 'បន្ថែម',
      prefixIcon: 'icon-[heroicons--plus-20-solid] !w-4 !h-4',
      id: 'add',
      click: () => openCreateModal(),
      disabled: !studentId.value,
    },
    {
      text: 'កែ',
      prefixIcon: 'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4',
      id: 'edit',
      click: () => openEditModal(selectedRecordId.value),
      disabled: selectedRecords.value.length !== 1,
    },
    {
      text: 'ប្តូរ',
      prefixIcon: 'icon-[heroicons--arrows-right-left] !w-4 !h-4',
      id: 'transfer',
      click: () => openTransferModal(selectedRecordId.value),
      disabled: selectedRecords.value.length !== 1 || !selectedRecord.value.isActive,
    },
    {
      text: 'Batch Upgrade',
      prefixIcon: 'icon-[game-icons--team-upgrade] !w-4 !h-4',
      id: 'batch-upgrade',
      click: () => openBatchUpgradeModal(selectedRecordIds.value),
      disabled: selectedRecords.value.length === 0,
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
    dataSource: gridDataSource(ListStudentServiceDocument),
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
    groupSettings: { showDropArea: false, columns: ['studyYearLocalized.name'] },
    selectionSettings: {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    },
    sortSettings: {
      columns: [
        { field: 'studyYearLocalized.name', direction: 'Descending' },
        { field: 'student.name', direction: 'Ascending' },
      ],
    },
  })

  // Public API
  return {
    // Grid
    gridConfig,
    logStoreGridConfig,
    gridToolbar,
    setGridRef,
    handleRowSelect,
    handleRowDeselect,
    // State
    studentId,
    disabledExport,
    // Methods
    setStudentId,
    // Form
    item,
    transferItem,
    batchUpgradeItem,
    selectedRecord,
    validationSchema,
    transferValidationSchema,
    batchUpgradeValidationSchema,
    exportParams,
  }
})
