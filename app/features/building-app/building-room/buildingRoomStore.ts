import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import * as v from 'valibot'
import type {
  ClickEventArgs,
  MenuEventArgs,
} from '@syncfusion/ej2-navigations'
import { v4 as uuidv4 } from 'uuid'
import { BuildingRoomCreate, BuildingRoomEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type {
  CreateRelatedUpsertBuildingRoomInput,
  EditBuildingRoomQuery,
} from '#gql/default'

export const useBuildingRoomStore = defineStore('buildingBuildingRoomStore', () => {
    type BuildingRoom = At<EditBuildingRoomQuery, 'editBuildingRoom'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<BuildingRoom>(initItem())
    const rows = Array.from({ length: 20 }, (_, index) => index)
    const columns = Array.from({ length: 15 }, (_, index) => index)
    const selectedColumns = ref<Set<number>>(new Set())
    const isDragging = ref(false)

    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      building: v.pipe(v.string('Please enter building'), v.nonEmpty('Please enter building')),
      floor: v.number('Please enter floor'),
      roomNo: v.pipe(v.string('Please enter room number'), v.nonEmpty('Please enter room number')),
      buildingRoomSeats: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          row: v.number('Please enter row'),
          column: v.number('Please enter column'),
          seatNo: v.pipe(v.string('Please enter seat number'), v.nonEmpty('Please enter seat number')),
        }),
      ),
    })
    const setGridRef = (component: GridComponent | null): void => {
      grid.value = component?.ej2Instances ? component?.ej2Instances : null
    }
    function initToolbar() {
      grid.value?.toolbarModule.enableItems(['edit'], false)
      grid.value?.contextMenuModule.contextMenu.enableItems(['Edit'], false)
    }
    function resetItem() {
      item.value = initItem()
    }
    function initItem(): BuildingRoom {
      return {
        id: uuidv4(),
        building: '',
        floor: 0,
        roomNo: '',
        buildingRoomSeats: [],
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function isSelected(
      row: number,
      column: number,
    ): boolean {
      return item.value.buildingRoomSeats.some(s => s.row == row && s.column == column)
    }

    function getCellInfo(
      row: number,
      column: number,
    ): string {
      return item.value.buildingRoomSeats.find(s => s.row == row && s.column == column)?.seatNo || ''
    }
    function selectedCellCSS(
      row: number,
      column: number,
    ): string {
      return isSelected(row, column) ? '!bg-primary-500' : ''
    }
    function onMouseDown(row: number, column: number) {
      isDragging.value = true
      onSelectCell(row, column)
    }
    function columnToLetter(column: number) {
      let temp: number,
        letter = ''
      while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
      }
      return letter
    }

    function onMouseOver(row: number, column: number) {
      if (isDragging.value) {
        onSelectCell(row, column)
      }
    }

    function onMouseUp() {
      isDragging.value = false
    }
    function removeSeat(row: number, column: number) {
      item.value.buildingRoomSeats = item.value.buildingRoomSeats.filter(s => s.row !== row || s.column != column)
    }

    function removeColumn(column: number) {
      selectedColumns.value.delete(column)
    }

    function addColumn(column: number) {
      selectedColumns.value.add(column)
    }

    function addSeat(row: number, column: number) {
      const seatNumberInColumn = item.value.buildingRoomSeats.filter(s => s.column === column).length + 1
      const indexOfColumn = Array.from(selectedColumns.value)
        .sort((a, b) => a - b)
        .indexOf(column)
      const seatNo = `${seatNumberInColumn}${columnToLetter(indexOfColumn + 1)}`
      item.value.buildingRoomSeats.push({ id: uuidv4(), row, column, seatNo })
    }

    function onSelectCell(row: number, column: number) {
      if (isSelected(row, column)) {
        removeSeat(row, column)
        removeColumn(column)
      }
      else {
        addColumn(column)
        addSeat(row, column)
      }
    }

    function toInput(item: BuildingRoom): CreateRelatedUpsertBuildingRoomInput {
      return {
        id: item.id,
        building: item.building,
        floor: item.floor,
        roomNo: item.roomNo,
        buildingRoomSeats: item.buildingRoomSeats.map(seat => ({
          id: seat.id,
          row: seat.row,
          column: seat.column,
          seatNo: seat.seatNo,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as BuildingRoom[]
      const id = selectedRecords[0]?.id ?? ''
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(BuildingRoomCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<BuildingRoom>) => {
              const result = await buildingBuildingRoomRepository.createReateUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertBuildingRoom.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(BuildingRoomEdit, {
            fullscreen: false,
            key: id,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
              const data = await buildingBuildingRoomService.edit(id)
              if (data.editBuildingRoom) {
                item.value = data.editBuildingRoom
              }
            },
            onSubmit: async (evt: FormSubmitEvent<BuildingRoom>) => {
              const result = await buildingBuildingRoomRepository.createReateUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertBuildingRoom.errors.length
              ) {
                showSuccessToast('កែប្រែបានជោគជ័យ')
                refreshGrid()
              }
            },
            onError: (_error) => {
              showErrorToast('សូមបញ្ចូលទិន្នន័យអោយបានត្រឹមត្រូវ')
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
      dataSource: gridDataSource(ListBuildingRoomDocument),
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
      rows,
      columns,
      validationSchema,
      getCellInfo,
      selectedCellCSS,
      onMouseDown,
      onMouseOver,
      onMouseUp,
    }
})
