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
import type { CreateUpsertCurrencyInput, CurrencyFragment } from '#gql'
import { CurrencyCreate, CurrencyEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import { CurrencySymbol, type EditCurrencyQuery } from '#gql/default'

export const useCurrencyStore = defineStore('currencyStore', () => {
    type Currency = At<EditCurrencyQuery, 'editCurrency'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<Currency>(initItem())
    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      symbol: v.pipe(v.string(), v.nonEmpty('Symbol must not be empty')),
      flag: v.pipe(v.string(), v.nonEmpty('Flag must not be empty')),
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
    function initItem(): Currency {
      return {
        id: uuidv4(),
        symbol: CurrencySymbol.KHR,
        flag: '',
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function toInput(item: Currency): CreateUpsertCurrencyInput {
      return {
        id: item.id,
        symbol: item.symbol,
        flag: item.flag,
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords
            = grid.value?.getSelectedRecords() as CurrencyFragment[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(CurrencyCreate, {
            fullscreen: false,

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<Currency>) => {
              const result = await currencyRepository.createUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createUpsertCurrency.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(CurrencyEdit, {
            fullscreen: false,

            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const data = await currencyService.edit(id)
              if (data.editCurrency) {
                item.value = data.editCurrency
              }
            },
            onSubmit: async (evt: FormSubmitEvent<Currency>) => {
              const result = await currencyRepository.createUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createUpsertCurrency.errors.length
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
      dataSource: gridDataSource(ListCurrencyDocument),
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
})
