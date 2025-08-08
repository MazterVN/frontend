import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import type { ClickEventArgs } from '@syncfusion/ej2-navigations'

export const usePermissionStore = defineStore('permissionStore', () => {
  const grid = ref<Grid | null>(null)

  const setGridRef = (component: GridComponent | null): void => {
    grid.value = component?.ej2Instances ? component?.ej2Instances : null
  }
  function initToolbar() {
    grid.value?.toolbarModule.enableItems(['edit'], false)
    grid.value?.contextMenuModule.contextMenu.enableItems(['Edit'], false)
  }
  function refreshGrid() {
    grid.value?.refresh()
  }
  async function generatePermission() {
    const result = await permissionRepository.generatePermissions()
    if (result) {
      showSuccessToast('បានបង្កើតដោយស្វ័យប្រវត្តិ')
      refreshGrid()
    }
  }

  async function handleToolbarClick(args: ClickEventArgs): Promise<void> {
    const toolbarId = args.item.id as 'generate'
    switch (toolbarId) {
      case 'generate':
        await generatePermission()
        break

      default:
        console.log('Unknown operation')
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
    dataSource: gridDataSource(ListPermissionDocument),
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
    toolbarClick: handleToolbarClick,
    rowSelected: handleRowSelect,
    rowDeselected: handleRowDeselect,
    toolbar: [
      {
        text: 'ស្វ័យបង្កើត',
        prefixIcon: 'icon-[noto--robot] !w-4 !h-4',
        id: 'generate',
      },
      'Search',
    ],
  })
  return {
    gridConfig,
    setGridRef,
    initToolbar,
  }
})
