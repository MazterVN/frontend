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
import { VersionCreate, VersionEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  PlatformType,
  type CreateUpsertVersionInput,
  type EditVersionQuery,
} from '#gql/default'

export const useVersionStore = defineStore('versionStore', () => {
    type Version = At<EditVersionQuery, 'editVersion'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<Version>(initItem())
    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      draft: v.boolean('Please check the draft'),
      platform: v.pipe(
        v.string('Please select the platform'),
        v.nonEmpty('Please select the platform'),
      ),
      appName: v.pipe(
        v.string('Please enter the app name'),
        v.nonEmpty('Please enter the app name'),
      ),
      version: v.pipe(
        v.string('Please enter the version'),
        v.nonEmpty('Please enter the version'),
      ),
      released: v.nullable(v.string('Please select the release date')),
      changes: v.pipe(
        v.string('Please enter the changes'),
        v.nonEmpty('Please enter the changes'),
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
    function initItem(): Version {
      return {
        id: uuidv4(),
        draft: true,
        platform: PlatformType.BACKEND_API,
        appName: '',
        version: '',
        released: null,
        changes: '',
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function toInput(item: Version): CreateUpsertVersionInput {
      return {
        id: item.id,
        draft: item.draft,
        platform: item.platform,
        appName: item.appName,
        version: item.version,
        released: item.released,
        changes: item.changes,
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as Version[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(VersionCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<Version>) => {
              const result = await versionRepository.createUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createUpsertVersion.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(VersionEdit, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const data = await versionService.edit(id)
              if (data.editVersion) {
                item.value = data.editVersion
              }
            },
            onSubmit: async (evt: FormSubmitEvent<Version>) => {
              const result = await versionRepository.createUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createUpsertVersion.errors.length
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
      dataSource: gridDataSource(ListVersionDocument),
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
