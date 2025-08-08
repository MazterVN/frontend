<script setup lang="ts">
import { ChevronRight, type LucideIcon } from 'lucide-vue-next'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import type { ActiveMenuPathFragment } from '#gql'

defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()

const route = useRoute()
const menuStore = useMenuStore()
const localePath = useLocalePath()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
</template>
