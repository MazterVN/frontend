<script setup lang="ts">
const store = useStudentNoteReportStore()
const { isLoading } = useLoadingIndicator()
const emit = defineEmits(['close', 'init'])
emit('init')
</script>

<template>
  <BaseModal
    :title="`មើលលម្អិត (${store.item?.studyYear?.nameLocalized} - ${store.item?.serviceName?.nameLocalized})`"
    :no-footer="true"
    :is-ready="store.isReady"
    :show-submit="false"
    @close="() => emit('close')"
  >
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12">
      <div class="sm:col-span-12">
        <div class="flex items-center space-x-3">
          <NuxtImg
            provider="cloudfront"
            placeholder
            class="w-[70px] h-[70px]"
            :src="store.item?.student?.s3ProfileUri ?? S3_URI_IMAGE_PLACEHOLDER"
            :modifiers="{
              edits: {
                resize: { width: 200, height: 200, fit: 'cover' },
              },
            }"
          />
          <div>
            <div class="font-semibold">
              {{ store.item?.student?.name }}
            </div>
            <div class="text-sm text-gray-500">
              {{ store.item?.student?.latin }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="store.item?.attachments?.length"
        class="sm:col-span-12"
      >
        <UCard
          class="w-full"
          :ui="{
            body: '',
            footer: '!px-2 py-1',
            header: '!px-2 py-1',
          }"
        >
          <template #header>
            <div class="font-semibold">
              កំណត់ហេតុ
            </div>
          </template>
          <div class="space-y-2">
            <EjsGrid
              v-bind="objectMemoize(store.gridConfigDetail())"
              id="grid-student-note-report-detail"
              :ref="store.setGridDetail"
              :data-source="store.item?.attachments ?? []"
              :row-selected="store.handleRowSelectDetail"
              :row-deselected="store.handleRowDeselectDetail"
              :toolbar="store.gridDetailToolbar"
            >
              <EColumns>
                <EColumn
                  type="checkbox"
                  width="40"
                />
                <EColumn
                  field="id"
                  :is-primary-key="true"
                  :visible="false"
                  header-text=""
                  text-align="Left"
                  :auto-fit="true"
                  :allow-searching="false"
                />
                <EColumn
                  field="studentNote.title"
                  header-text="ចំណងជើង"
                  text-align="Left"
                  :auto-fit="true"
                  :allow-searching="false"
                />
                <EColumn
                  field="typeNameLocalized"
                  header-text="ប្រភេទ"
                  text-align="Left"
                  :auto-fit="true"
                  :allow-searching="false"
                />
                <EColumn
                  field="uri"
                  header-text="ឯកសារ"
                  text-align="Left"
                  :template="'file'"
                >
                  <template #file="{ data }">
                    <div
                      class="text-right truncate"
                      dir="rtl"
                    >
                      {{ getFileNameFromS3URI(data.uri) || "......" }}
                    </div>
                  </template>
                </EColumn>
                <EColumn
                  header-text="ទាញយក"
                  text-align="Center"
                  :template="'download'"
                  width="100"
                >
                  <template #download="{ data }">
                    <div>
                      <UButton
                        class="p-1.5"
                        data-testid="download-report"
                        :ui="{
                          base: 'rounded-full',
                        }"
                        :disabled="isLoading"
                        variant="ghost"
                        size="sm"
                        @click="store.presignedAndDownloadFile(data.uri)"
                      >
                        <i class="icon-[heroicons--arrow-down-tray] w-4 h-4" />
                      </UButton>
                    </div>
                  </template>
                </EColumn>
              </EColumns>
            </EjsGrid>
          </div>
        </UCard>
      </div>
    </div>
  </BaseModal>
</template>
