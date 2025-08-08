import * as v from 'valibot'
import { v4 as uuidv4 } from 'uuid'
import type {
  ActiveMenuPathFragment,
  ActiveMenuPathInput,
  CreateRelatedUpsertMenuInput,
  ListRootMenuQuery,
  MenuInput,
  MenuPermissionInput,
} from '#gql'
import { ActiveMenuPathOp } from '#gql/default'

type Menu = At<ListRootMenuQuery, 'listRootMenus'>
type MenuPermission = At<ListRootMenuQuery, 'listRootMenus.menuPermissions'>

export const useMenuStore = defineStore('menuStore', () => {
  const sidebarOpen = ref(false)
  const submenuOpen = ref<boolean>(true)
  const menus = ref<Menu[]>([])
  const activeMenu = ref<Menu>()

  function initActivePath(): ActivePath {
    return {
      id: uuidv4(),
      op: ActiveMenuPathOp.CONTAINS,
      path: '',
    }
  }
  function initMenuPermission(): MenuPermission {
    return {
      id: uuidv4(),
      permissionId: '',
    }
  }
  function initItem(menus: Menu[]): Menu {
    return {
      id: uuidv4(),
      iconClass: '',
      localizedGettextId: '',
      position: menus.length + 1,
      gettextId: '',
      path: '',
      permissionKey: '',
      activePaths: [],
      menuPermissions: [],
      menus: [],
    }
  }

  function removeMenu(menus: Ref<Menu[]>, id: string) {
    const index = menus.value.findIndex(item => item.id === id)
    if (index !== -1) {
      menus.value.splice(index, 1)
    }
  }

  function addMenu(menus: Ref<Menu[]>) {
    menus.value.push(initItem(menus.value))
  }
  function removeActivePath(activePaths: ActivePath[], id: string) {
    const index = activePaths.findIndex(item => item.id === id)
    activePaths.splice(index, 1)
  }
  function addActivePath(activePaths: ActivePath[]) {
    activePaths.push(initActivePath())
  }
  function removeMenuPermission(
    menuPermissions: MenuPermission[],
    id: string,
  ) {
    const index = menuPermissions.findIndex(item => item.id === id)
    menuPermissions.splice(index, 1)
  }

  function addMenuPermission(menuPermissions: MenuPermission[]) {
    menuPermissions.push(initMenuPermission())
  }
  const validationSchema = v.array(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
    }),
  )
  function toggleSubmenu() {
    submenuOpen.value = !submenuOpen.value
  }
  function activeMenuCSS(
    activePaths: ActiveMenuPathFragment[],
    currentPath: string,
  ): string {
    return isActiveMenu(activePaths, currentPath)
      ? 'bg-md-on-surface text-md-surface-variant'
      : 'text-md-on-surface-variant hover:bg-md-on-surface hover:text-md-surface-variant'
  }
  function setActiveMenu(idOrCurrentPath: string) {
    const activeRootMenu = menus.value.find(
      menu =>
        menu.id == idOrCurrentPath
        || isActiveMenu(
          menu.activePaths as ActiveMenuPathFragment[],
          idOrCurrentPath,
        ),
    )
    activeMenu.value = activeRootMenu
  }
  function setActiveMenuClicked(idOrCurrentPath: string) {
    setActiveMenu(idOrCurrentPath)
    sidebarOpen.value = false
    submenuOpen.value = true
  }
  async function fetchMenu() {
    try {
      const data = await menuRepository.listRoot()
      menus.value = data.listRootMenus
    }
    catch (err) {
      console.log(err)
    }
  }

  function toActiveMenuPathInput(data: ActivePath): ActiveMenuPathInput {
    return {
      id: data.id,
      op: data.op,
      path: data.path,
    }
  }
  function toMenuPermissionInput(
    data: MenuPermission,
  ): MenuPermissionInput {
    return {
      id: data.id,
      permissionId: data.permissionId,
    }
  }
  function toMenuInput(data: Menu): MenuInput {
    return {
      id: data.id,
      iconClass: data.iconClass,
      position: data.position,
      gettextId: data.gettextId,
      path: data.path,
      permissionKey: data.permissionKey,
      activePaths: data.activePaths?.map(toActiveMenuPathInput) ?? [],
      menuPermissions:
                    data.menuPermissions?.map(toMenuPermissionInput) ?? [],
      menus:
                    data.menus?.map(menu => toMenuInput(menu as Menu)) ?? [],
    }
  }
  function toInput(data: Menu[]): CreateRelatedUpsertMenuInput {
    return {
      menus: data.map(toMenuInput),
    }
  }

  async function createRelatedUpsert() {
    const result = await menuRepository.createRelatedUpsert(
      toInput(menus.value),
    )
    if (result && !result?.createRelatedUpsertMenu.errors.length) {
      showSuccessToast('កែប្រែបានជោគជ័យ')
    }
  }

  return {
    sidebarOpen,
    submenuOpen,
    fetchMenu,
    toggleSubmenu,
    setActiveMenu,
    setActiveMenuClicked,
    activeMenuCSS,
    activeMenu,
    menus,
    validationSchema,
    addActivePath,
    removeActivePath,
    addMenuPermission,
    removeMenuPermission,
    addMenu,
    removeMenu,
    createRelatedUpsert,
  }
},
{
  persist: {
    omit: ['activeMenu', 'menus', 'validationSchema'],
  },
},
)
