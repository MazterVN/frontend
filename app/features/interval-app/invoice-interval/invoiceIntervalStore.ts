import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import { v4 as uuidv4 } from 'uuid'
import * as v from 'valibot'
import type {
  ClickEventArgs,
  MenuEventArgs,
} from '@syncfusion/ej2-navigations'
import { InvoiceIntervalCreate, InvoiceIntervalEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  IntervalMode,
  type CreateUpsertInvoiceIntervalInput,
  type EditInvoiceIntervalQuery,
} from '#gql/default'

export const useInvoiceIntervalStore = defineStore(
  'invoiceIntervalStore',
  () => {
        type InvoiceInterval = At<
          EditInvoiceIntervalQuery,
          'editInvoiceInterval'
        >
        const modal = useModalStore()
        const grid = ref<Grid | null>(null)
        const item = ref<InvoiceInterval>(initItem())

        const validationSchema = v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          day: v.pipe(
            v.number('Please enter a valid number'),
            v.minValue(0),
            v.maxValue(30),
          ),
          mode: v.pipe(
            v.string('Please select a mode'),
            v.nonEmpty('Please select a mode'),
          ),
        })
        const setGridRef = (component: GridComponent | null): void => {
          grid.value = component?.ej2Instances ? component?.ej2Instances : null
        }
        function initToolbar() {
          grid.value?.toolbarModule.enableItems(['edit'], false)
          grid.value?.contextMenuModule.contextMenu.enableItems(
            ['Edit'],
            false,
          )
        }
        function initItem(): InvoiceInterval {
          return {
            id: uuidv4(),
            day: 0,
            mode: IntervalMode.AFTER,
          }
        }
        function resetItem() {
          item.value = initItem()
        }
        function refreshGrid() {
          grid.value?.refresh()
        }
        function toInput(
          item: InvoiceInterval,
        ): CreateUpsertInvoiceIntervalInput {
          return {
            id: item.id,
            day: item.day,
            mode: item.mode,
          }
        }

        function handleToolbarClick(args: ClickEventArgs): void {
          const selectedRecords
                = grid.value?.getSelectedRecords() as InvoiceInterval[]
          const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
          switch (toolbarId) {
            case 'add':
              modal.open(InvoiceIntervalCreate, {
                fullscreen: false,
                ui: {
                  width: 'w-full sm:max-w-2xl',
                },

                onInit: async () => {
                  resetItem()
                },
                onSubmit: async (
                  evt: FormSubmitEvent<InvoiceInterval>,
                ) => {
                  const result
                                = await invoiceIntervalRepository.createUpsert(
                                  toInput(evt.data),
                                )
                  if (
                    result
                    && !result?.createUpsertInvoiceInterval.errors
                      .length
                  ) {
                    showSuccessToast('បន្ថែមបានជោគជ័យ')
                    resetItem()
                    refreshGrid()
                  }
                },
                onClose: () => {

                },
              })
              break

            case 'edit':
              modal.open(InvoiceIntervalEdit, {
                fullscreen: false,

                ui: {
                  width: 'w-full sm:max-w-2xl',
                },
                onInit: async () => {
                  resetItem()
                  const id = selectedRecords[0]?.id ?? ''
                  const result
                                = await invoiceIntervalRepository.edit(id)
                  if (result?.editInvoiceInterval) {
                    item.value = result.editInvoiceInterval
                  }
                },
                onSubmit: async (
                  evt: FormSubmitEvent<InvoiceInterval>,
                ) => {
                  const result
                                = await invoiceIntervalRepository.createUpsert(
                                  toInput(evt.data),
                                )
                  if (
                    result
                    && !result?.createUpsertInvoiceInterval.errors
                      .length
                  ) {
                    showSuccessToast('កែប្រែបានជោគជ័យ')
                    refreshGrid()
                  }
                },
                onClose: () => {

                },
              })
              break

            case 'delete':
              console.log('Performing delete operation')
              break

            default:
              console.log('Unknown operation')
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
          dataSource: gridDataSource(ListInvoiceIntervalDocument),
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
            { text: 'បន្ថែម', prefixIcon: 'icon-[heroicons--plus-20-solid] !w-4 !h-4', id: 'add' },
            { text: 'កែ', prefixIcon: 'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4', id: 'edit' },
            'Search',
          ],
        })
        return {
          gridConfig,
          setGridRef,
          initToolbar,
          item,
          validationSchema,
        }
  },
)
