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
import { UserEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import type { EditUserQuery, UpdateRelatedUserInput } from '#gql/default'

export const useUserStore = defineStore('userStore', () => {
    type User = At<EditUserQuery, 'editUser'>
    type UserRole = At<EditUserQuery, 'editUser.userRoles'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<User>(initItem())
    function defaultRoleChanged(event: Event, id: string) {
      const target = event.target as HTMLInputElement
      const checked = target.checked
      item.value.userRoles.forEach((role) => {
        if (role.id === id) {
          role.isDefault = checked
        }
        else {
          role.isDefault = false
        }
      })
    }

    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      active: v.boolean(),
      superUser: v.boolean(),
      fullName: v.string('Please enter a valid full name'),
      userRoles: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          isDefault: v.boolean(),
          roleId: v.pipe(
            v.string('Please select a role'),
            v.nonEmpty('Please select a role'),
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
    function initUserRole(): UserRole {
      return {
        id: uuidv4(),
        isDefault: false,
        roleId: '',
      }
    }
    function initItem(): User {
      return {
        id: uuidv4(),
        emailOrPhone: '',
        active: false,
        superUser: false,
        fullName: '',
        employeeId: '',
        studentId: '',
        bucket: '',
        bucketFolder: '',
        userRoles: [initUserRole()],
      }
    }
    function resetItem() {
      item.value = initItem()
    }
    function removeUserRole(id: string) {
      item.value.userRoles = item.value.userRoles.filter(
        role => role.id !== id,
      )
    }
    function addUserRole() {
      item.value.userRoles.push(initUserRole())
    }
    function refreshGrid() {
      grid.value?.refresh()
    }
    function toInput(item: User): UpdateRelatedUserInput {
      return {
        id: item.id,
        emailOrPhone: item.emailOrPhone,
        active: item.active,
        superUser: item.superUser,
        fullName: item.fullName,
        employeeId: item.employeeId,
        studentId: item.studentId,
        bucket: item.bucket,
        bucketFolder: item.bucketFolder,
        userRoles: item.userRoles.map(role => ({
          id: role.id,
          isDefault: role.isDefault,
          roleId: role.roleId,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords() as User[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'edit':
          modal.open(UserEdit, {
            fullscreen: false,

            ui: {
              width: 'w-full sm:max-w-2xl',
            },
            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const result = await userRepository.edit(id)
              if (result?.editUser) {
                item.value = result.editUser
              }
            },
            onSubmit: async (evt: FormSubmitEvent<User>) => {
              const result = await userRepository.updateRelated(
                item.value.id,
                toInput(evt.data),
              )
              if (result && !result?.updateRelatedUser.errors.length) {
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
      dataSource: gridDataSource(ListUserDocument),
      contextMenuItems: toContextMenuItems([
        {
          id: 'edit',
          text: 'Edit',
          iconCss: 'e-menu-icon icon-[lucide--edit] !w-4 !h-4',
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
          text: 'កែ',
          prefixIcon: 'icon-[lucide--edit] !w-4 !h-4',
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
      addUserRole,
      removeUserRole,
      defaultRoleChanged,
    }
})
