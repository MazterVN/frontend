import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from '@syncfusion/ej2-vue-grids'
import {
  Grid,
  Group,
  Page,
  Selection,
  Sort,
  Resize,
  Toolbar,
  ContextMenu,
  Freeze,
  Edit,
} from '@syncfusion/ej2-grids'
import { DropDownListComponent, MultiSelectComponent, CheckBoxSelection, MultiSelect } from '@syncfusion/ej2-vue-dropdowns'
import { FileManagerComponent, FileManager, Toolbar as FMToolbar, NavigationPane, DetailsView } from '@syncfusion/ej2-vue-filemanager'
import { registerLicense } from '@syncfusion/ej2-base'

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmZCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXtednRRQmRfV01yXUZWYUA=')

export default defineNuxtPlugin({
  name: 'global-component-plugin',
  enforce: 'pre',
  parallel: true,
  async setup(nuxtApp) {
    nuxtApp.vueApp.component('EjsFilemanager', FileManagerComponent)
    nuxtApp.vueApp.component('EjsGrid', GridComponent)
    nuxtApp.vueApp.component('EColumns', ColumnsDirective)
    nuxtApp.vueApp.component('EColumn', ColumnDirective)
    nuxtApp.vueApp.component('EjsDropdownlist', DropDownListComponent)
    nuxtApp.vueApp.component('EjsMultiSelect', MultiSelectComponent)
    Grid.Inject(Page, Edit, Group, Selection, Sort, Resize, Freeze, Toolbar, ContextMenu)
    FileManager.Inject(FMToolbar, NavigationPane, DetailsView)
    MultiSelect.Inject(CheckBoxSelection)
  },
})
