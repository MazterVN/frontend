<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import type { ActiveMenuPathFragment } from '#gql'

const route = useRoute()
const menuStore = useMenuStore()
const localePath = useLocalePath()
</script>

<template>
  <aside
    class="fixed bottom-0 lg:left-20 top-16 w-72 overflow-y-auto border-r sm:px-4 lg:px-4 border-gray-200 dark:border-gray-800 bg-md-surface-container-low"
  >
    <UButton
      v-if="menuStore.submenuOpen"
      icon="tabler:layout-sidebar-left-collapse"
      size="xs"
      color="primary"
      square
      class="absolute right-0 top-0 m-1 shadow-sm z-50"
      @click="menuStore.toggleSubmenu()"
    />
    <SidebarProvider>
      <SidebarGroup>
        <SidebarMenu>
          <Collapsible
            v-for="item in menuStore.activeMenu?.menus || []"
            :key="item.id"
            as-child
            :default-open="isActiveMenu(
              item.activePaths as ActiveMenuPathFragment[],
              trimLocalePath(route.path),
            )"
            class="group/collapsible"
          >
            <SidebarMenuItem v-if="!item.menus.length">
              <CollapsibleTrigger as-child>
                <NuxtLink :to="localePath(item.path)">
                  <SidebarMenuButton
                    :tooltip="item.localizedGettextId ?? ''"
                    :is-active="trimLocalePath(route.path) == item.path"
                    class="cursor-pointer"
                  >
                    <UKbd>
                      {{ item.localizedGettextId?.[0] || "S" }}
                    </UKbd>
                    <span>{{ item.localizedGettextId }}</span>
                  </SidebarMenuButton>
                </NuxtLink>
              </CollapsibleTrigger>
            </SidebarMenuItem>
            <SidebarMenuItem v-else>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.localizedGettextId ?? ''">
                  <UKbd>
                    {{ item.localizedGettextId?.[0] || "S" }}
                  </UKbd>
                  <span>{{ item.localizedGettextId }}</span>
                  <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem
                    v-for="subItem in item.menus"
                    :key="subItem.id"
                  >
                    <SidebarMenuSubButton
                      as-child
                      :is-active="trimLocalePath(route.path) == subItem.path"
                      class="dark:text-md-on-surface dark:hover:text-md-surface-container-low"
                      :class="{ 'dark:text-md-surface-container-low': trimLocalePath(route.path) == subItem.path }"
                    >
                      <NuxtLink :to="localePath(subItem.path)">
                        <span>{{ subItem.localizedGettextId }}</span>
                      </NuxtLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarProvider>
  </aside>
</template>
