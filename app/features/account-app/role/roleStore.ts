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
import { RoleCreate, RoleEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type {
  CreateRelatedUpsertRoleInput,
  EditRoleQuery,
} from '#gql/default'

export const useRoleStore = defineStore('roleStore', () => {
    type Role = At<EditRoleQuery, 'editRole'>
    type RolePermission = At<EditRoleQuery, 'editRole.rolePermissions'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<Role>(initItem())
    const permissionIds = ref<Set<string>>(new Set())
    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      name: v.pipe(
        v.string('Name must not be empty'),
        v.nonEmpty('Name must not be empty'),
      ),
      description: v.pipe(
        v.string('Description must not be empty'),
        v.nonEmpty('Description must not be empty'),
      ),
    })
    const setGridRef = (component: GridComponent | null): void => {
      grid.value = component?.ej2Instances ? component?.ej2Instances : null
    }
    function toPermissionIdsSet(
      rolePermissions: RolePermission[],
    ): Set<string> {
      return new Set(
        rolePermissions.map(
          rolePermission => rolePermission.permissionId,
        ),
      )
    }
    function addRolePermission(permissionId: string): void {
      item.value.rolePermissions.push({
        id: uuidv4(),
        permissionId: permissionId,
      })
    }
    function removeRolePermission(permissionId: string): void {
      item.value.rolePermissions = item.value.rolePermissions.filter(
        rolePermission => rolePermission.permissionId !== permissionId,
      )
    }
    function isActivePermission(permissionId: string): boolean {
      return permissionIds.value.has(permissionId)
    }
    function togglePermission(checked: boolean, permissionId: string): void {
      if (checked) {
        permissionIds.value.add(permissionId)
        addRolePermission(permissionId)
      }
      else {
        permissionIds.value.delete(permissionId)
        removeRolePermission(permissionId)
      }
    }
    function initToolbar() {
      grid.value?.toolbarModule.enableItems(['edit'], false)
      grid.value?.contextMenuModule.contextMenu.enableItems(['Edit'], false)
    }
    function resetItem() {
      item.value = initItem()
      permissionIds.value = new Set()
    }
    function initItem(): Role {
      return {
        id: uuidv4(),
        name: '',
        description: '',
        rolePermissions: [],
      }
    }
    function refreshGrid() {
      grid.value?.refresh()
    }

    function toInput(item: Role): CreateRelatedUpsertRoleInput {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        rolePermissions: item.rolePermissions.map(rolePermission => ({
          id: rolePermission.id,
          permissionId: rolePermission.permissionId,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as Role[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(RoleCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (evt: FormSubmitEvent<Role>) => {
              const result = await roleRepository.bulkCreateUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertRole.errors.length
              ) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(RoleEdit, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-4xl',
            },

            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const data = await roleService.edit(id)
              if (data.editRole) {
                item.value = data.editRole
                permissionIds.value = toPermissionIdsSet(
                  data.editRole.rolePermissions,
                )
              }
            },
            onSubmit: async (evt: FormSubmitEvent<Role>) => {
              const result = await roleRepository.bulkCreateUpsert(
                toInput(evt.data),
              )
              if (
                result
                && !result?.createRelatedUpsertRole.errors.length
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
      dataSource: gridDataSource(ListRoleDocument),
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
      permissionIds,
      togglePermission,
      isActivePermission,
    }
})
