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
import type { CreateUpsertCurrencyBaseInput } from '#gql'
import { CurrencyBaseCreate, CurrencyBaseEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type { EditCurrencyBaseQuery } from '#gql/default'

export const useCurrencyBaseStore = defineStore('currencyBaseStore', () => {
    type CurrencyBase = At<EditCurrencyBaseQuery, 'editCurrencyBase'>
    type CurrencyRate = At<
      EditCurrencyBaseQuery,
      'editCurrencyBase.currencyRates'
    >
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<CurrencyBase>(initItem())
    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      currencyId: v.pipe(
        v.string('Please select a currency'),
        v.nonEmpty('Please select a currency'),
      ),
      currencyRates: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          currencyId: v.pipe(
            v.string('Please select a currency'),
            v.nonEmpty('Please select a currency'),
          ),
          rate: v.pipe(v.number('Please enter a number'), v.minValue(0)),
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

    function initCurrencyRate(): CurrencyRate {
      return {
        id: uuidv4(),
        currencyId: '',
        rate: 0,
      }
    }
    function initItem(): CurrencyBase {
      return {
        id: uuidv4(),
        currencyId: '',
        currencyRates: [initCurrencyRate()],
      }
    }
    function addCurrencyRate() {
      item.value.currencyRates.push(initCurrencyRate())
    }
    function removeCurrencyRate(id: string) {
      item.value.currencyRates = item.value.currencyRates.filter(
        rate => rate.id !== id,
      )
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function toInput(item: CurrencyBase): CreateUpsertCurrencyBaseInput {
      return {
        id: item.id,
        currencyId: item.currencyId,
        currencyRates: item.currencyRates.map(rate => ({
          id: rate.id,
          currencyId: rate.currencyId,
          rate: rate.rate,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords
            = grid.value?.getSelectedRecords() as CurrencyBase[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(CurrencyBaseCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-2xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<CurrencyBase>) => {
              const result
                            = await currencyBaseRepository.createUpsert(
                              toInput(evt.data),
                            )
              if (
                result
                && !result?.createUpsertCurrencyBase.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(CurrencyBaseEdit, {
            fullscreen: false,

            ui: {
              width: 'w-full sm:max-w-2xl',
            },
            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const data = await currencyBaseService.edit(id)
              if (data.editCurrencyBase) {
                item.value = data.editCurrencyBase
              }
            },
            onSubmit: async (evt: FormSubmitEvent<CurrencyBase>) => {
              const result
                            = await currencyBaseRepository.createUpsert(
                              toInput(evt.data),
                            )
              if (
                result
                && !result?.createUpsertCurrencyBase.errors.length
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
      dataSource: gridDataSource(ListCurrencyBaseDocument),
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
      addCurrencyRate,
      removeCurrencyRate,
    }
})
