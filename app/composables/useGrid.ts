import type { Grid } from '@syncfusion/ej2-vue-grids'

export const useGrid = <T extends Component>(c: T): UseGridReturn => {
  // State
  const component = shallowRef(c)
  const grid = computed(() => component.value?.grid as InstanceType<typeof Grid> | null)

  // Modules
  const toolbarModule = computed(() => grid.value?.toolbarModule)
  const contextMenuModule = computed(() => grid.value?.contextMenuModule)

  // Grid methods
  const getSelectedRecords = (): object[] | undefined => {
    return grid.value?.getSelectedRecords()
  }

  const setCellValue = (
    key: string | number,
    field: string,
    value: string | number | boolean | Date | null,
  ) => {
    grid.value?.setCellValue(key, field, value)
  }

  const refresh = () => {
    grid.value?.refresh()
  }

  return {
    // State
    grid,
    component,

    // Modules
    toolbarModule,
    contextMenuModule,

    // Methods
    setCellValue,
    refresh,
    getSelectedRecords,
  }
}
