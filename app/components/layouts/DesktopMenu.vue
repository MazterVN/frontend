<script setup lang="ts">
import type { ActiveMenuPathFragment } from '#gql'

const route = useRoute()
const menuStore = useMenuStore()
const localePath = useLocalePath()
</script>

<template>
  <div
    class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:flex-col lg:overflow-y-auto lg:bg-md-surface-container"
  >
    <div
      class="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <img
        class="rounded-[1.25rem] p-2 h-full"
        src="~/assets/logo.png"
        alt="SMS"
      >
    </div>
    <nav class="mt-4 flex flex-1">
      <ul
        role="list"
        class="flex flex-col flex-1 items-center divide-y divide-gray-300 dark:divide-gray-600"
      >
        <li
          v-for="item in menuStore.menus"
          :key="item.id"
          class="w-full last:mt-auto"
        >
          <NuxtLink
            v-if="item.path !== '/settings/grades/study-years'"
            :to="localePath(item.path)"
            :class="[
              menuStore.activeMenuCSS(
                item.activePaths as ActiveMenuPathFragment[],
                trimLocalePath(route.path),
              ),
              'group flex gap-x-3 w-full p-2 text-sm font-semibold leading-6',
            ]"
            @click="menuStore.setActiveMenuClicked(item.id)"
          >
            <div class="flex flex-col items-center w-full gap-[3px]">
              <i
                :class="[item.iconClass, 'h-5 w-5 shrink-0']"
                aria-hidden="true"
              />
              <div class="text-xs">
                {{ item.localizedGettextId }}
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            v-else
            :to="localePath(item.path)"
            :class="[
              menuStore.activeMenuCSS(
                item.activePaths as ActiveMenuPathFragment[],
                trimLocalePath(route.path),
              ),
              'group flex gap-x-3 w-full p-2 text-sm font-semibold leading-6',
            ]"
            @click="menuStore.setActiveMenuClicked(item.id)"
          >
            <div class="flex items-center w-full gap-[4px]">
              <i
                :class="[item.iconClass, 'h-5 w-5 shrink-0']"
                aria-hidden="true"
              />
              <div class="text-xs">
                {{ item.localizedGettextId }}
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
