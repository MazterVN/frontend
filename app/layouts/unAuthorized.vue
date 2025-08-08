<script setup lang="ts">
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
</script>

<template>
  <div>
    <div class="top-nav">
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
                variant="solid"
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

    <main>
      <div class="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 relative">
        <slot />
      </div>
    </main>
  </div>
</template>
