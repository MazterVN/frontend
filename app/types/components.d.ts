import type {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
} from '@syncfusion/ej2-vue-grids'

import type { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-vue-dropdowns'
import type { FileManagerComponent } from '@syncfusion/ej2-vue-filemanager'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    EjsFilemanager: typeof FileManagerComponent
    EjsGrid: typeof GridComponent
    EColumns: typeof ColumnsDirective
    EColumn: typeof ColumnDirective
    EjsDropdownlist: typeof DropDownListComponent
    EjsMultiSelect: typeof MultiSelectComponent
  }
}
