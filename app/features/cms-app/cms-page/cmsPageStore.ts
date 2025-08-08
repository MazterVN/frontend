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
import { CmsPageCreate, CmsPageEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type {
  CreateUpsertCmsPageInput,
  EditCmsPageQuery,
} from '#gql/default'

export const useCmsPageStore = defineStore('cmsPageStore', () => {
    type CmsPage = At<EditCmsPageQuery, 'editCmsPage'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<CmsPage>(initItem())

    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      title: v.pipe(
        v.string('Title must not be empty'),
        v.nonEmpty('Title must not be empty'),
      ),
      slug: v.pipe(
        v.string('Slug must not be empty'),
        v.nonEmpty('Slug must not be empty'),
      ),
      markdown: v.pipe(
        v.string('Markdown must not be empty'),
        v.nonEmpty('Markdown must not be empty'),
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
    function initItem(): CmsPage {
      return {
        id: uuidv4(),
        title: '',
        slug: '',
        markdown: '',
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function toInput(item: CmsPage): CreateUpsertCmsPageInput {
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        markdown: item.markdown,
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as CmsPage[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(CmsPageCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<CmsPage>) => {
              const result = await cmsPageRepository.bulkCreateUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createUpsertCmsPage.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(CmsPageEdit, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const data = await cmsPageService.edit(id)
              if (data.editCmsPage) {
                item.value = data.editCmsPage
              }
            },
            onSubmit: async (evt: FormSubmitEvent<CmsPage>) => {
              const result = await cmsPageRepository.bulkCreateUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createUpsertCmsPage.errors.length
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
      dataSource: gridDataSource(ListCmsPageDocument),
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
        {
          text: 'បន្ថែម',
          prefixIcon: 'icon-[heroicons--plus-20-solid] !w-4 !h-4',
          id: 'add',
        },
        {
          text: 'កែ',
          prefixIcon:
                    'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4',
          id: 'edit',
        },
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
