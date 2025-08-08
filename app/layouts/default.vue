<script setup lang="ts">
import type { ActiveMenuPathFragment } from '#gql'

const route = useRoute()
const menuStore = useMenuStore()
const localePath = useLocalePath()
await menuStore.fetchMenu()
menuStore.setActiveMenu(route.path)
useSeoMeta({
  title: 'School Management System',
  ogTitle: 'School Management System',
  description:
    'School Management System is a software that helps schools to manage their daily operations digitally. It is a complete solution for schools to manage their students, teachers, classes, and more.',
  ogDescription:
    'School Management System is a software that helps schools to manage their daily operations digitally. It is a complete solution for schools to manage their students, teachers, classes, and more.',
  ogImage:
    'https://cdn.cloudware.com.kh/pks-bucket-prod/pks-assets/pks-contact.jpg',
})
const isHomePage = computed(() => route.path == '/')
</script>

<template>
  <div>
    <UDrawer
      v-model:open="menuStore.sidebarOpen"
      :handle="false"
      direction="left"
      :ui="{ content: '!rounded-r-none' }"
    >
      <template #content>
        <div
          class="flex grow flex-col gap-y-5 overflow-y-auto bg-md-surface-container px-6 pb-2 ring-1 ring-white/10 min-w-[18rem]"
        >
          <div class="flex h-16 shrink-0 items-center">
            <img
              class="h-9 w-auto rounded"
              src="~/assets/logo.png"
              alt="SMS"
            >
          </div>
          <nav class="flex flex-1 flex-col">
            <ul
              role="list"
              class="-mx-2 flex-1 space-y-1"
            >
              <li
                v-for="item in menuStore.menus"
                :key="item.id"
              >
                <NuxtLink
                  :to="localePath(item.path)"
                  :class="[
                    menuStore.activeMenuCSS(
                      item.activePaths as ActiveMenuPathFragment[],
                      trimLocalePath(route.path),
                    ),
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                  ]"
                  @click="menuStore.setActiveMenuClicked(item.id)"
                >
                  <i
                    :class="[item.iconClass, 'h-6 w-6 shrink-0']"
                    aria-hidden="true"
                  />
                  {{ item.localizedGettextId }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </template>
    </UDrawer>
    <!-- Static sidebar for desktop -->
    <LayoutsDesktopMenu />
    <div class="lg:pl-20">
      <div class="top-nav">
        <UButton
          type="button"
          variant="ghost"
          color="neutral"
          icon="heroicons:bars-3"
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden cursor-pointer"
          @click="menuStore.sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
        </UButton>

        <!-- Separator -->
        <USeparator
          orientation="vertical"
          class="h-6 lg:hidden"
        />

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div class="relative flex flex-1 items-center">
            <div class="w-full">
              <UInput
                icon="i-heroicons-magnifying-glass-20-solid"
                size="lg"
                variant="none"
                :trailing="false"
                placeholder="ស្វែងរក..."
              />
            </div>
          </div>
          <div class="flex items-center gap-x-4">
            <ClientOnly>
              <LayoutsColorMode />
              <template #fallback>
                <UButton
                  class="p-1.5"
                  color="neutral"
                  variant="outline"
                  aria-label="Theme"
                >
                  <i class="icon-[gg--dark-mode] w-5 h-5" />
                </UButton>
              </template>
            </ClientOnly>
            <LayoutsLanguage />
            <USeparator
              orientation="vertical"
              class="h-6"
            />
            <LayoutsAccount />
          </div>
        </div>
      </div>

      <main :class="[menuStore.submenuOpen ? 'lg:pl-72' : '', '']">
        <div
          :class="{
            'relative': true,
            'px-4 py-10 sm:px-6 lg:px-8 lg:py-6': !isHomePage,
            'pl-0 lg:pl-2.4': isHomePage,
          }"
        >
          <UButton
            v-if="!isHomePage"
            icon="tabler:layout-sidebar-right-collapse"
            size="xs"
            color="primary"
            square
            :class="[
              menuStore.submenuOpen ? 'hidden' : '',
              'absolute left-0 top-0 m-1 shadow-sm z-50',
            ]"
            @click="menuStore.toggleSubmenu()"
          />
          <slot />
        </div>
      </main>
    </div>
    <LayoutsSubmenu v-if="menuStore.submenuOpen" />
  </div>
</template>
