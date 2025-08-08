import type { ContextMenu, Grid, Toolbar, ToolbarItems, ToolbarItem } from '@syncfusion/ej2-vue-grids'
import type { ShallowRef } from 'vue'
import type { ItemModel } from '@syncfusion/ej2-navigations'
import type { ListRootMenuQuery, SignInMutation } from '#gql'

export type FileManagerType = {
  name: string
  filterPath: string
}

export type FileMetadata = {
  id: string
  key: string
  bucket: string
  uri: string
  namespace?: string
}

export type DBUser = At<SignInMutation, 'signIn.result'>

export type GridComponent = {
  ej2Instances: Grid | null
}

export type ActivePath = At<ListRootMenuQuery, 'listRootMenus.activePaths'>

export type DatePickerType = 'year' | 'years' | 'month' | 'months' | 'date' | 'dates' | 'week' | 'datetime' | 'datetimerange' | 'daterange' | 'monthrange' | 'yearrange'
export type SingleOrRange<T> = T | [T, T]
export type DateModelType = number | string | Date
export type DateModelValueType = SingleOrRange<DateModelType> | string[]

export interface UseGridReturn {
  // State
  grid: ComputedRef<InstanceType<typeof Grid> | null>
  component: ShallowRef<Component>

  // Modules
  toolbarModule: ComputedRef<Toolbar | undefined>
  contextMenuModule: ComputedRef<ContextMenu | undefined>

  // Methods
  setCellValue: (key: string | number, field: string, value: string | number | boolean | Date | null) => void
  refresh: () => void
  getSelectedRecords: () => object[] | undefined
}

export type ToolbarItemType = ToolbarItems | string | ItemModel | ToolbarItem

type FormErrorItem = {
  id: string
  path: string
  message: string
}

export type FormError = {
  errors: FormErrorItem[]
}
