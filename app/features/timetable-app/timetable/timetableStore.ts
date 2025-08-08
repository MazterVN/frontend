import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import { Predicate, Query } from '@syncfusion/ej2-data'
import * as v from 'valibot'
import type {
  ClickEventArgs,
  MenuEventArgs,
} from '@syncfusion/ej2-navigations'
import { v4 as uuidv4 } from 'uuid'
import type {
  BulkCreateUpsertTimetableInput,
  GetTimetableAsTableQuery,
  TimetablesBulkCreateUpsertTimetablesInput,
} from '#gql/default'

export const useTimetableStore = defineStore('timetableStore', () => {
    type GetTimetable = At<GetTimetableAsTableQuery, 'getTimetableAsTable'>
    type Timetable = At<GetTimetable, 'times.days'>
    type TimetableTime = At<GetTimetable, 'times'>
    const grid = ref<Grid | null>(null)
    const item = ref<GetTimetable>(initItem())
    const itemParam = ref<Timetable & { studyYearId: string }>(initItemParam())
    const selectedTimetableId = ref<string | null>(null)
    const editTimetableId = ref<string | null>(null)
    const timetableEmployeeStore = useTimetableEmployeeStore()

    const allowSaveBtn = computed(() => {
      return item.value.times.length > 0 && !!itemParam.value.serviceDetailId
    })

    const subjectGroupingPredicate = computed<Predicate[]>(() => {
      return [
        new Predicate('timetables.subjectGroupingId', 'equal', itemParam.value.subjectGroupingId),
        new Predicate('timetables.serviceDetailId', 'equal', itemParam.value.serviceDetailId),
      ]
    })

    const selectedTimetable = computed<Timetable | null>(() => {
      return item.value.times.flatMap(time => time.days).find(day => day.id === selectedTimetableId.value) || null
    })

    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      title: v.pipe(
        v.string('Title must not be empty'),
        v.nonEmpty('Title must not be empty'),
      ),
      slug: v.pipe(
        v.string('Slug must not be empty'),
        v.nonEmpty('Slug must not be empty'),
      ),
      markdown: v.pipe(
        v.string('Markdown must not be empty'),
        v.nonEmpty('Markdown must not be empty'),
      ),
    })

    watch(() => [itemParam.value.serviceDetailId, itemParam.value.subjectGroupingId], ([serviceDetailId, subjectGroupingId]) => {
      if (!serviceDetailId || !subjectGroupingId) {
        resetItem()
        return
      }
      getAsTable()
    }, { immediate: true })

    const setGridRef = (component: GridComponent | null): void => {
      grid.value = component?.ej2Instances ? component?.ej2Instances : null
    }
    async function getAsTable() {
      const tmpSubjectGroupingId = itemParam.value.subjectGroupingId || uuidv4()
      const tmpServiceDetailId = itemParam.value.serviceDetailId || uuidv4()
      const data = await timetableRepository.getAsTable(tmpSubjectGroupingId, tmpServiceDetailId)
      if (data.getTimetableAsTable) {
        item.value = data.getTimetableAsTable
      }
    }
    function initToolbar() {
      grid.value?.toolbarModule.enableItems(['edit'], false)
      grid.value?.contextMenuModule.contextMenu.enableItems(['Edit'], false)
    }
    function resetItem() {
      item.value = initItem()
    }
    function initTime(): TimetableTime {
      return {
        id: uuidv4(),
        startTime: '00:00:00',
        endTime: '00:00:00',
        days: item.value.headers.map(header => ({
          id: uuidv4(),
          subjectGroupingId: itemParam.value.subjectGroupingId,
          subjectGroupingDetailId: '',
          serviceDetailId: itemParam.value.serviceDetailId,
          daysOfWeekId: header.id,
          startTime: '00:00:00',
          endTime: '00:00:00',
          subjectCalc: '-',
        }),
        ),
      }
    }
    function initItem(): GetTimetable {
      return {
        id: uuidv4(),
        subjectGroupingId: '',
        serviceDetailId: '',
        headers: [],
        times: [],
      }
    }
    function initItemParam(): Timetable & { studyYearId: string } {
      return {
        id: uuidv4(),
        studyYearId: '',
        subjectGroupingId: '',
        subjectGroupingDetailId: '',
        daysOfWeekId: '',
        serviceDetailId: '',
      }
    }
    function toInput(item: GetTimetable): BulkCreateUpsertTimetableInput {
      return {
        subjectGroupingId: item.subjectGroupingId,
        serviceDetailId: item.serviceDetailId,
        timetables: item.times.flatMap(time => time.days.map(day => toTimetableInput(time.startTime, time.endTime, day))),
      }
    }
    async function submit() {
      const result = await timetableRepository.bulkCreateUpsert(
        toInput(item.value),
      )
      if (
        result
        && !result?.bulkCreateUpsertTimetable.errors.length
      ) {
        showSuccessToast('បានរក្សាទុកជោគជ័យ')
      }
    }

    function removeTime(id: string) {
      item.value.times = item.value.times.filter(time => time.id !== id)
    }

    function addTime() {
      item.value.times.push(initTime())
    }
    function updateTime(time: TimetableTime, event: [string, string] | null) {
      if (!event) {
        time.startTime = '00:00:00'
        time.endTime = '00:00:00'
        return
      }
      time.startTime = event[0]
      time.endTime = event[1]
    }

    function setSelectedTimetableId(id: string) {
      if (id === selectedTimetableId.value) return
      selectedTimetableId.value = id
      const predicate = Predicate.and([
        new Predicate('timetables.id', 'equal', id),
        ...subjectGroupingPredicate.value,
      ])
      timetableEmployeeStore.updateToolbarStatus('add', true)
      timetableEmployeeStore.updateGridQuery(new Query().where(predicate))
      editTimetableId.value = null
    }

    function updateSubjectGroupingDetail(day: Timetable, value: string) {
      if (day.id !== editTimetableId.value) return
      day.subjectGroupingDetailId = value
    }

    function clickOutsideEdit(id: string) {
      if (id !== editTimetableId.value) return
      editTimetableId.value = null
    }

    function toTimetableInput(startTime: string, endTime: string, item: Timetable): TimetablesBulkCreateUpsertTimetablesInput {
      return {
        id: item.id,
        subjectGroupingId: item.subjectGroupingId,
        subjectGroupingDetailId: item.subjectGroupingDetailId,
        serviceDetailId: item.serviceDetailId,
        daysOfWeekId: item.daysOfWeekId,
        startTime: startTime,
        endTime: endTime,
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'delete':
          console.log('Performing delete operation')
          // Perform delete operation logic here
          break

        default:
          console.log('Unknown operation')
          // Handle unknown operation
          break
      }
    }

    function handleContextMenuClick(args: MenuEventArgs): void {
      const toolbarId = args.item.id as 'edit'
      switch (toolbarId) {
        case 'edit':
          break

        default:
          console.log('Unknown operation')
          // Handle unknown operation
          break
      }
    }

    function handleRowSelect(_args: RowSelectEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords()
      grid.value?.toolbarModule.enableItems(
        ['edit'],
        selectedRecords?.length === 1,
      )
      grid.value?.contextMenuModule.contextMenu.enableItems(
        ['Edit'],
        selectedRecords?.length === 1,
      )
    }

    function handleRowDeselect(_args: RowDeselectEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords()
      grid.value?.toolbarModule.enableItems(
        ['edit'],
        selectedRecords?.length === 1,
      )
      grid.value?.contextMenuModule.contextMenu.enableItems(
        ['Edit'],
        selectedRecords?.length === 1,
      )
    }

    const gridConfig = (): GridModel => ({
      ...globalGridConfig,
      dataSource: gridDataSource(ListTimetableEmployeDocument),
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
      toolbarClick: handleToolbarClick,
      contextMenuClick: handleContextMenuClick,
      rowSelected: handleRowSelect,
      rowDeselected: handleRowDeselect,
      toolbar: [
        {
          text: 'បន្ថែម',
          prefixIcon: 'icon-[heroicons--plus-20-solid] !w-4 !h-4',
          id: 'add',
        },
        {
          text: 'កែ',
          prefixIcon:
                    'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4',
          id: 'edit',
        },
        'Search',
      ],
    })

    const subjectGroupingQuery = computed(() => {
      return new Query()
        .take(35)
        .requiresCount()
        .where('studyYearId', 'equal', itemParam.value.studyYearId)
    })

    const serviceDetailQuery = computed(() => {
      return new Query()
        .take(35)
        .requiresCount()
        .where('subjectGroupingId', 'equal', itemParam.value.subjectGroupingId)
    })

    const subjectGroupingDetailQuery = computed(() => {
      return new Query()
        .take(35)
        .requiresCount()
        .where('subjectGroupingId', 'equal', itemParam.value.subjectGroupingId)
    })

    return {
      gridConfig,
      setGridRef,
      getAsTable,
      initToolbar,
      removeTime,
      addTime,
      item,
      itemParam,
      selectedTimetableId,
      clickOutsideEdit,
      editTimetableId,
      setSelectedTimetableId,
      validationSchema,
      updateSubjectGroupingDetail,
      allowSaveBtn,
      submit,
      updateTime,
      selectedTimetable,
      subjectGroupingQuery,
      serviceDetailQuery,
      subjectGroupingDetailQuery,
    }
})
