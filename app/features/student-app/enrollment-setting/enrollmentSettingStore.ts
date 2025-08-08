import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import type { ChangeEventArgs } from '@syncfusion/ej2-vue-dropdowns'
import { enrollmentSettingRepository } from './enrollmentSettingRepository'
import type { CreateRelatedEnrollmentSettingInput, EditEnrollmentSettingQuery } from '#gql'
import { EnrollmentSettingCreate, EnrollmentSettingEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import { AcademicDisciplineType } from '#gql/default'

export const useEnrollmentSettingStore = defineStore('enrollmentSettingStore', () => {
// Types
type EnrollmentSetting = At<EditEnrollmentSettingQuery, 'editEnrollmentSetting'>
type EnrollmentSettingSourceDetail = At<EditEnrollmentSettingQuery, 'editEnrollmentSetting.enrollmentSettingSources'>
type EnrollmentSettingDestinationDetail = At<EditEnrollmentSettingQuery, 'editEnrollmentSetting.enrollmentSettingDestinations'>

// Store Dependencies
const modal = useModalStore()
const currentEnrollmentStudyYearStore = useCurrentEnrollmentStudyYearStore()
const { start, finish } = useLoadingIndicator()

// State
let grid: Grid | null = null
const item = ref<EnrollmentSetting>(initItem('', ''))
const selectedRecords = ref<EnrollmentSetting[]>([])
const isReady = ref(false)

// Computed
const selectedRecordId = computed<string>(() => selectedRecords.value?.[0]?.id ?? '')
const sourceStudyYearId = computed<string>(() => currentEnrollmentStudyYearStore.item.sourceStudyYearId)
const destinationStudyYearId = computed<string>(() => currentEnrollmentStudyYearStore.item.destinationStudyYearId)

// Validation Schema
const validationSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string('Please enter a name'), v.nonEmpty('Please enter a name')),
  sourceStudyYearId: v.pipe(v.string('Please select source study year'), v.nonEmpty('Please select source study year')),
  destinationStudyYearId: v.pipe(v.string('Please select destination study year'), v.nonEmpty('Please select destination study year')),
  seatDatetimeStart: v.pipe(v.string('Please select start date'), v.nonEmpty('Please select start date')),
  seatDatetimeEnd: v.pipe(v.string('Please select end date'), v.nonEmpty('Please select end date')),
  enrollmentSettingSources: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      studyYearId: v.pipe(v.string('Please select study year'), v.nonEmpty('Please select study year')),
      subjectGroupingId: v.pipe(v.string('Please select subject grouping'), v.nonEmpty('Please select subject grouping')),
      serviceDetailId: v.pipe(v.string('Please select service detail'), v.nonEmpty('Please select service detail')),
    }),
  ),
  enrollmentSettingDestinations: v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      studyYearId: v.pipe(v.string('Please select study year'), v.nonEmpty('Please select study year')),
      subjectGroupingId: v.pipe(v.string('Please select subject grouping'), v.nonEmpty('Please select subject grouping')),
      serviceDetailId: v.pipe(v.string('Please select service detail'), v.nonEmpty('Please select service detail')),
      buildingRoomId: v.pipe(v.string('Please select room'), v.nonEmpty('Please select room')),
      maxSeat: v.pipe(
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
  'Search',
])

const gridConfig = (): GridModel => ({
  ...globalGridConfig,
  dataSource: gridDataSource(ListEnrollmentSettingsDocument),
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
  selectedRecords.value = (grid?.getSelectedRecords() || []) as EnrollmentSetting[]
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
function initSourceDetail(studyYearId: string, subjectGroupingId: string): EnrollmentSettingSourceDetail {
  return {
    id: uuidv4(),
    studyYearId: studyYearId,
    subjectGroupingId: subjectGroupingId,
    serviceDetailId: '',
  }
}

function initDestinationDetail(studyYearId: string, subjectGroupingId: string): EnrollmentSettingDestinationDetail {
  return {
    id: uuidv4(),
    academicDiscipline: AcademicDisciplineType.OTHER,
    studyYearId: studyYearId,
    subjectGroupingId: subjectGroupingId,
    serviceDetailId: '',
    buildingRoomId: '',
    maxSeat: 0,
  }
}

function initItem(sourceStudyYearId: string, destinationStudyYearId: string): EnrollmentSetting {
  return {
    id: uuidv4(),
    name: '',
    sourceStudyYearId: sourceStudyYearId,
    destinationStudyYearId: destinationStudyYearId,
    seatDatetimeStart: '',
    seatDatetimeEnd: '',
    enrollmentSettingSources: [initSourceDetail('', '')],
    enrollmentSettingDestinations: [initDestinationDetail('', '')],
  }
}

function resetItem(sourceStudyYearId: string, destinationStudyYearId: string) {
  item.value = initItem(sourceStudyYearId, destinationStudyYearId)
}

function addSourceDetail() {
  const lastSourceDetail = item.value.enrollmentSettingSources[item.value.enrollmentSettingSources.length - 1]
  item.value.enrollmentSettingSources.push(initSourceDetail(lastSourceDetail?.studyYearId ?? item.value.sourceStudyYearId, lastSourceDetail?.subjectGroupingId ?? ''))
}

function removeSourceDetail(id: string) {
  item.value.enrollmentSettingSources = item.value.enrollmentSettingSources.filter(detail => detail.id !== id)
}

function addDestinationDetail() {
  const lastDestinationDetail = item.value.enrollmentSettingDestinations[item.value.enrollmentSettingDestinations.length - 1]
  item.value.enrollmentSettingDestinations.push(initDestinationDetail(lastDestinationDetail?.studyYearId ?? item.value.destinationStudyYearId, lastDestinationDetail?.subjectGroupingId ?? ''))
}

function removeDestinationDetail(id: string) {
  item.value.enrollmentSettingDestinations = item.value.enrollmentSettingDestinations.filter(detail => detail.id !== id)
}

function sourceStudyYearChanged(args: ChangeEventArgs) {
  const studyYearId = args.value as string
  item.value.enrollmentSettingSources.forEach((detail) => {
    // Assign study year id to all source details
    detail.studyYearId = studyYearId
    // Reset subject grouping id and service detail id to all source details
    detail.subjectGroupingId = ''
    detail.serviceDetailId = ''
  })
}

function destinationStudyYearChanged(args: ChangeEventArgs) {
  const studyYearId = args.value as string
  item.value.enrollmentSettingDestinations.forEach((detail) => {
    detail.studyYearId = studyYearId
    // Reset subject grouping id and service detail id to all destination details
    detail.subjectGroupingId = ''
    detail.serviceDetailId = ''
  })
}

// Data Transformation
function toInput(data: EnrollmentSetting): CreateRelatedEnrollmentSettingInput {
  return {
    id: data.id,
    name: data.name,
    sourceStudyYearId: data.sourceStudyYearId,
    destinationStudyYearId: data.destinationStudyYearId,
    seatDatetimeStart: data.seatDatetimeStart,
    seatDatetimeEnd: data.seatDatetimeEnd,
    enrollmentSettingSources: data.enrollmentSettingSources.map(detail => ({
      id: detail.id,
      studyYearId: detail.studyYearId,
      subjectGroupingId: detail.subjectGroupingId,
      serviceDetailId: detail.serviceDetailId,
    })),
    enrollmentSettingDestinations: data.enrollmentSettingDestinations.map(detail => ({
      id: detail.id,
      studyYearId: detail.studyYearId,
      subjectGroupingId: detail.subjectGroupingId,
      serviceDetailId: detail.serviceDetailId,
      buildingRoomId: detail.buildingRoomId,
      maxSeat: detail.maxSeat,
    })),
  }
}

// Modal Methods
function openCreateModal() {
  isReady.value = false
  modal.open(EnrollmentSettingCreate, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      await currentEnrollmentStudyYearStore.readOne()
      resetItem(sourceStudyYearId.value, destinationStudyYearId.value)
      sourceStudyYearChanged({ value: sourceStudyYearId.value } as ChangeEventArgs)
      destinationStudyYearChanged({ value: destinationStudyYearId.value } as ChangeEventArgs)
      await delay(500)
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<EnrollmentSetting>) => {
      start()
      const result = await enrollmentSettingRepository.createRelated(toInput(evt.data))
      if (!result?.createRelatedEnrollmentSetting.errors.length) {
        showSuccessToast('បន្ថែមបានជោគជ័យ')
        resetItem(sourceStudyYearId.value, destinationStudyYearId.value)
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
  modal.open(EnrollmentSettingEdit, {
    ui: {
      width: 'w-full sm:max-w-4xl',
    },
    fullscreen: false,

    onInit: async () => {
      start()
      resetItem('', '')
      const data = await enrollmentSettingRepository.edit(id)
      if (data?.editEnrollmentSetting) {
        item.value = data.editEnrollmentSetting
      }
      await delay()
      finish()
      isReady.value = true
    },
    onSubmit: async (evt: FormSubmitEvent<EnrollmentSetting>) => {
      start()
      const result = await enrollmentSettingRepository.updateRelated(id, toInput(evt.data))
      if (!result?.updateRelatedEnrollmentSetting.errors.length) {
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
  addSourceDetail,
  removeSourceDetail,
  addDestinationDetail,
  removeDestinationDetail,
  sourceStudyYearChanged,
  destinationStudyYearChanged,
}
})
