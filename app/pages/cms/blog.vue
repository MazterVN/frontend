<script setup lang="ts">
const store = useCmsBlogStore()
const gridRef = ref(null)
watchEffect(() => {
  if (gridRef.value) {
    store.setGridRef(gridRef.value)
    store.initToolbar()
  }
})
onUnmounted(() => {
  store.setGridRef(null)
})
</script>

<template>
  <EjsGrid
    v-bind="store.gridConfig()"
    id="grid-cms-blogs"
    ref="gridRef"
  >
    <EColumns>
      <EColumn
        text-align="Left"
        width="85"
        :template="'thumbnail'"
        :allow-searching="false"
      >
        <template #thumbnail="{ data }">
          <NuxtImg
            provider="cloudfront"
            placeholder
            class="w-[70px] h-[70px]"
            :src="data?.thumbnail?.uri ?? S3_URI_IMAGE_PLACEHOLDER"
            :modifiers="{
              edits: {
                resize: { width: 200, height: 200, fit: 'cover' },
              },
            }"
          />
        </template>
      </EColumn>
      <EColumn
        field="title"
        header-text="ចំណងជើង"
        text-align="Left"
        width="400"
      />
      <EColumn
        text-align="Left"
        header-text="ម្ចាស់"
        :auto-fit="true"
        :template="'author'"
        :allow-searching="false"
      >
        <template #author="{ data }">
          <div class="flex items-center">
            <UAvatar
              size="md"
              :src="data?.authorPicture ?? IMAGE_PLACEHOLDER"
              alt="Author"
            />
            <div class="ml-2">
              <div class="text-xs">
                {{ data?.authorName }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ data?.authorEmailOrPhone }}
              </div>
            </div>
          </div>
        </template>
      </EColumn>
      <EColumn
        field="compartmentLocalized"
        header-text="ផ្នែក"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        field="categoryLocalized"
        header-text="ប្រភេទ"
        text-align="Left"
        :auto-fit="true"
      />
      <EColumn
        text-align="Left"
        header-text="បង្កើតនៅ"
        field="insertedAt"
        :auto-fit="true"
        :template="'insertedAt'"
        :allow-searching="false"
      >
        <template #insertedAt="{ data }">
          <div class="flex items-center">
            {{ data.durationLocalized }}, {{ $dayjs(data.insertedAt).format('DD/MM/YYYY hh:mm A') }}
          </div>
        </template>
      </EColumn>
    </EColumns>
  </EjsGrid>
</template>
