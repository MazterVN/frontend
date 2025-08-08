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
import { CmsBlogCreate, CmsBlogEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  BlogCategoryEnum,
  BlogCompartmentEnum,
  type CreateRelatedUpsertCmsBlogInput,
  type EditCmsBlogQuery,
} from '#gql/default'

export const useCmsBlogStore = defineStore('cmsBlogStore', () => {
    type CmsBlog = At<EditCmsBlogQuery, 'editCmsBlog'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<CmsBlog>(initItem())

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
      compartment: v.pipe(
        v.string('Please select a compartment'),
        v.nonEmpty('Please select a compartment'),
      ),
      category: v.pipe(
        v.string('Please select a category'),
        v.nonEmpty('Please select a category'),
      ),
      markdown: v.pipe(
        v.string('Markdown must not be empty'),
        v.nonEmpty('Markdown must not be empty'),
      ),
      thumbnails: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          bucket: v.pipe(v.string(), v.nonEmpty()),
          key: v.pipe(v.string(), v.nonEmpty()),
          name: v.pipe(v.string(), v.nonEmpty()),
          uid: v.number(),
          namespace: v.pipe(v.string(), v.nonEmpty()),
          uri: v.pipe(v.string(), v.nonEmpty()),
        }),
      ),
      attachments: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          bucket: v.pipe(v.string(), v.nonEmpty()),
          key: v.pipe(v.string(), v.nonEmpty()),
          name: v.pipe(v.string(), v.nonEmpty()),
          uid: v.number(),
          namespace: v.pipe(v.string(), v.nonEmpty()),
          uri: v.pipe(v.string(), v.nonEmpty()),
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
    function initItem(): CmsBlog {
      return {
        id: uuidv4(),
        title: '',
        slug: '',
        compartment: BlogCompartmentEnum.PKS_MOBILE_HOME_PAGE,
        category: BlogCategoryEnum.ACTIVITY,
        markdown: '',
        thumbnails: [],
        attachments: [],
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function toInput(item: CmsBlog): CreateRelatedUpsertCmsBlogInput {
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        compartment: item.compartment,
        category: item.category,
        markdown: item.markdown,
        thumbnails: item.thumbnails.map(thumbnail => ({
          id: thumbnail.id,
          bucket: thumbnail.bucket,
          key: thumbnail.key,
          namespace: thumbnail.namespace,
        })),
        attachments: item.attachments.map(attachment => ({
          id: attachment.id,
          bucket: attachment.bucket,
          key: attachment.key,
          namespace: attachment.namespace,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as CmsBlog[]
      const id = selectedRecords[0]?.id ?? ''
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(CmsBlogCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-full mx-2',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<CmsBlog>) => {
              const result = await cmsBlogRepository.createRelatedUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertCmsBlog.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(CmsBlogEdit, {
            fullscreen: false,
            key: id,
            ui: {
              width: 'w-full sm:max-w-full mx-2',
            },

            onInit: async () => {
              resetItem()
              const data = await cmsBlogService.edit(id)
              if (data.editCmsBlog) {
                item.value = data.editCmsBlog
              }
            },
            onSubmit: async (evt: FormSubmitEvent<CmsBlog>) => {
              const result = await cmsBlogRepository.createRelatedUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertCmsBlog.errors.length
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
      dataSource: gridDataSource(ListCmsBlogDocument),
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
