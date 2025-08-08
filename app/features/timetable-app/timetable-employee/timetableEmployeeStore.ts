import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import type { Query } from '@syncfusion/ej2-data'
import { Predicate } from '@syncfusion/ej2-data'
import * as v from 'valibot'
import type {
  ClickEventArgs,
  MenuEventArgs,
} from '@syncfusion/ej2-navigations'
import { v4 as uuidv4 } from 'uuid'
import { TimetableEmployeeCreate, TimetableEmployeeEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  TimetableEmployeeType,
  type CreateRelatedUpsertTimetableEmployeeInput,
  type EditTimetableEmployeeQuery,
} from '#gql/default'

export const useTimetableEmployeeStore = defineStore('timetableEmployeeStore', () => {
    type TimetableEmployee = At<EditTimetableEmployeeQuery, 'editTimetableEmployee'>
    type TimetableEmployeeTimetable = At<EditTimetableEmployeeQuery, 'editTimetableEmployee.timetableEmployeeTimetables'>
    const timetableStore = useTimetableStore()
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<TimetableEmployee>(initItem())
    const selectedTimetableIds = ref<string[]>([])
    const timetablePredicate = computed<Predicate[]>(() => {
      return [
        new Predicate('subjectGroupingId', 'equal', timetableStore.selectedTimetable?.subjectGroupingId ?? null),
        new Predicate('serviceDetailId', 'equal', timetableStore.selectedTimetable?.serviceDetailId ?? null),
        new Predicate('subjectGroupingDetailId', 'equal', timetableStore.selectedTimetable?.subjectGroupingDetailId ?? null),
      ]
    })
    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      employeeId: v.pipe(
        v.string('Please select a employee'),
        v.nonEmpty('Please select a employee'),
      ),
      type: v.pipe(
        v.string('Please select a type'),
        v.nonEmpty('Please select a type'),
      ),
      startDate: v.nullable(v.string()),
      endDate: v.nullable(v.string()),
      timetableEmployeeTimetables: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          timetableId: v.pipe(
            v.string('Please select a timetable'),
            v.nonEmpty('Please select a timetable'),
          ),
        }),
      ),
    })
    const setGridRef = (component: GridComponent | null): void => {
      grid.value = component?.ej2Instances ? component?.ej2Instances : null
    }
    function toTimetableEmployeeTimetables(ids: string[]): TimetableEmployeeTimetable[] {
      return ids.map((id) => {
        const oldIdOrUuid = item.value.timetableEmployeeTimetables.find(tet => tet.timetableId === id)?.id
        return {
          id: oldIdOrUuid ?? uuidv4(),
          timetableId: id,
        }
      })
    }
    function initToolbar() {
      grid.value?.toolbarModule.enableItems(['edit'], false)
      grid.value?.toolbarModule.enableItems(['add'], false)
    }
    function updateToolbarStatus(type: 'add' | 'edit', status: boolean) {
      grid.value?.toolbarModule.enableItems([type], status)
    }
    function resetItem() {
      item.value = initItem()
      selectedTimetableIds.value = []
    }
    function initItem(): TimetableEmployee {
      return {
        id: uuidv4(),
        employeeId: '',
        type: TimetableEmployeeType.DEFAULT,
        startDate: null,
        endDate: null,
        timetableEmployeeTimetables: [],
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function updateGridQuery(query: Query) {
      setTimeout(() => {
        if (!grid.value?.query) return
        grid.value.query = query
      }, 500)
    }

    function toInput(data: TimetableEmployee): CreateRelatedUpsertTimetableEmployeeInput {
      item.value.timetableEmployeeTimetables = toTimetableEmployeeTimetables(selectedTimetableIds.value)
      return {
        id: data.id,
        employeeId: data.employeeId,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        timetableEmployeeTimetables: data.timetableEmployeeTimetables.map(
          tet => ({
            id: tet.id,
            timetableId: tet.timetableId,
          }),
        ),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as TimetableEmployee[]
      const id = selectedRecords[0]?.id ?? ''
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(TimetableEmployeeCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<TimetableEmployee>) => {
              const result = await timetableEmployeeRepository.createRelatedUpsert(toInput(evt.data))
              if (
                result
                && !result?.createRelatedUpsertTimetableEmployee.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(TimetableEmployeeEdit, {
            fullscreen: false,
            key: id,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
              const data = await timetableEmployeeService.edit(id)
              if (data.editTimetableEmployee) {
                item.value = data.editTimetableEmployee
                selectedTimetableIds.value = data.editTimetableEmployee.timetableEmployeeTimetables.map(tet => tet.timetableId)
              }
            },
            onSubmit: async (evt: FormSubmitEvent<TimetableEmployee>) => {
              const result = await timetableEmployeeRepository.createRelatedUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertTimetableEmployee.errors.length
              ) {
                showSuccessToast('កែប្រែបានជោគជ័យ')
                refreshGrid()
              }
            },

          })

          break

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
      dataSource: gridDataSource(ListTimetableEmployeeDocument),
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
    return {
      gridConfig,
      setGridRef,
      initToolbar,
      item,
      validationSchema,
      updateGridQuery,
      selectedTimetableIds,
      timetablePredicate,
      updateToolbarStatus,
    }
})
