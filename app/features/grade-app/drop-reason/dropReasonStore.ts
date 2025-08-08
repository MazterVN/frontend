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
import type { CreateRelatedDropReasonInput, EditDropReasonQuery } from '#gql'
import { DropReasonCreate, DropReasonEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import { Language } from '#gql/default'

export const useDropReasonStore = defineStore('dropReasonStore', () => {
    type DropReason = At<EditDropReasonQuery, 'editDropReason'>
    type DropReasonItem = At<EditDropReasonQuery, 'editDropReason.dropReasons'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<DropReason>(initItem())
    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      name: v.pipe(v.string(), v.nonEmpty()),
      language: v.pipe(v.string(), v.nonEmpty()),
      dropReasons: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          name: v.pipe(v.string('Please enter a valid name'), v.nonEmpty('Please enter a valid name')),
          language: v.pipe(v.string(), v.nonEmpty()),
          languageValue: v.pipe(v.string(), v.nonEmpty()),
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
    function initChild(language: Language): DropReasonItem {
      return {
        id: uuidv4(),
        name: '',
        language: language,
        languageValue: language == Language.KM ? 'ខ្មែរ' : 'អង់គ្លេស',
      }
    }
    function initItem(): DropReason {
      return {
        id: uuidv4(),
        name: 'Master Record',
        language: Language.KM,
        dropReasons: [
          initChild(Language.KM),
          initChild(Language.EN),
        ],
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }
    function toInput(data: DropReason): CreateRelatedDropReasonInput {
      return {
        id: data.id,
        name: data.name,
        language: data.language,
        dropReasons: data.dropReasons.map(item => ({
          id: item.id,
          name: item.name,
          language: item.language,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords
            = grid.value?.getSelectedRecords() as DropReason[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      const id = selectedRecords[0]?.id ?? ''
      switch (toolbarId) {
        case 'add':
          modal.open(DropReasonCreate, {
            fullscreen: false,

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (
              evt: FormSubmitEvent<DropReason>,
            ) => {
              const result = await dropReasonRepository.createRelated(
                toInput(evt.data),
              )
              if (!result?.createRelatedDropReason.errors.length) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(DropReasonEdit, {
            fullscreen: false,

            onInit: async () => {
              resetItem()
              const data = await dropReasonService.edit(id)
              if (data?.editDropReason) {
                item.value = data.editDropReason
              }
            },
            onSubmit: async (
              evt: FormSubmitEvent<DropReason>,
            ) => {
              const result = await dropReasonRepository.updateRelated(id, toInput(evt.data))
              if (!result?.updateRelatedDropReason.errors.length) {
                showSuccessToast('កែប្រែបានជោគជ័យ')
                refreshGrid()
              }
            },
            onError: (error: Error) => {
              console.error(error)
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
      dataSource: gridDataSource(ListDropReasonDocument),
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
