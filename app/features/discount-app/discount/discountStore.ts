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
import { DiscountCreate, DiscountEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type {
  CreateRelatedUpsertDiscountInput,
  EditDiscountQuery,
} from '#gql/default'

export const useDiscountStore = defineStore('discountStore', () => {
    type Discount = At<EditDiscountQuery, 'editDiscount'>
    type StudentServiceDiscount = At<
      EditDiscountQuery,
      'editDiscount.studentServiceDiscounts'
    >
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<Discount>(initItem())

    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      startsAt: v.pipe(v.string('Please enter a valid date'), v.nonEmpty('Please enter a valid date')),
      expiresAt: v.pipe(v.string('Please enter a valid date'), v.nonEmpty('Please enter a valid date')),
      value: v.pipe(
        v.number('Please enter a valid number'),
        v.minValue(0),
        v.maxValue(100),
      ),
      description: v.pipe(
        v.string('Please enter a description'),
        v.nonEmpty('Please enter a description'),
      ),
      studentServiceDiscounts: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          studentServiceId: v.pipe(
            v.string('Please select a student service'),
            v.nonEmpty('Please select a student service'),
          ),
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

    function initStudentServiceDiscount(): StudentServiceDiscount {
      return {
        id: uuidv4(),
        studentServiceId: '',
      }
    }
    function initItem(): Discount {
      return {
        id: uuidv4(),
        startsAt: null,
        expiresAt: null,
        value: 0,
        description: '',
        studentServiceDiscounts: [initStudentServiceDiscount()],
      }
    }
    function resetItem() {
      item.value = initItem()
    }
    function addStudentServiceDiscount() {
      item.value.studentServiceDiscounts.push(initStudentServiceDiscount())
    }
    function removeStudentServiceDiscount(id: string) {
      item.value.studentServiceDiscounts
            = item.value.studentServiceDiscounts.filter(ssd => ssd.id !== id)
    }
    function refreshGrid() {
      grid.value?.refresh()
    }
    function toInput(item: Discount): CreateRelatedUpsertDiscountInput {
      return {
        id: item.id,
        startsAt: item.startsAt,
        expiresAt: item.expiresAt,
        value: item.value,
        description: item.description,
        studentServiceDiscounts: item.studentServiceDiscounts.map(
          ssd => ({
            id: ssd.id,
            studentServiceId: ssd.studentServiceId,
          }),
        ),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as Discount[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(DiscountCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-2xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<Discount>) => {
              const result
                            = await discountRepository.createRelatedUpsert(
                              toInput(evt.data),
                            )
              if (
                !result?.createRelatedUpsertDiscount.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(DiscountEdit, {
            fullscreen: false,

            ui: {
              width: 'w-full sm:max-w-2xl',
            },
            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const result = await discountRepository.edit(id)
              if (result?.editDiscount) {
                item.value = result.editDiscount
              }
            },
            onSubmit: async (evt: FormSubmitEvent<Discount>) => {
              const result
                            = await discountRepository.createRelatedUpsert(
                              toInput(evt.data),
                            )
              if (
                !result?.createRelatedUpsertDiscount.errors.length
              ) {
                showSuccessToast('កែប្រែបានជោគជ័យ')
                refreshGrid()
              }
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
      dataSource: gridDataSource(ListDiscountDocument),
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
      addStudentServiceDiscount,
      removeStudentServiceDiscount,
    }
})
