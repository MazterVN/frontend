<script setup lang="ts">
const store = useParentStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')
</script>

<template>
  <BaseModal
    title="កែប្រែ"
    :is-ready="store.isReady"
    submit-title="រក្សាទុក"
    @close="() => emit('close')"
    @submit="() => formRef?.submit()"
  >
    <UForm
      ref="formRef"
      :schema="store.validationSchema"
      :state="store.item"
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div class="sm:col-span-3">
        <UFormField
          name="name"
          label="គោត្តនាម-នាម"
        >
          <UInput
            v-model="store.item.name"
            data-testid="name"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="latin"
          label="គោត្តនាម-នាមឡាតាំង"
        >
          <UInput
            v-model="store.item.latin"
            data-testid="latin"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="type"
          label="ប្រភេទ"
        >
          <DropdownList
            id="type"
            v-model="store.item.type"
            data-testid="type"
            :graphql-query="ListLocalizedParentTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="job"
          label="មុខរបរ"
        >
          <DropdownList
            id="job"
            v-model="store.item.job"
            data-testid="job"
            :graphql-query="ListLocalizedJobTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="tel"
          label="លេខទូរស័ព្ទ"
        >
          <UInput
            v-model="store.item.tel"
            data-testid="tel"
          />
        </UFormField>
      </div>
      <div
        v-if="store.item.studentServices.length"
        class="sm:col-span-full"
      >
        <UFormField
          label="សិស្ស"
        >
          <EjsGrid
            v-bind="objectMemoize(store.studentServiceGridConfig())"
            id="grid-student-services"
            :data-source="store.item.studentServices"
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
                field="studyYear.nameLocalized"
                header-text="ឆ្នាំសិក្សា"
                text-align="Left"
                :auto-fit="true"
              />
              <EColumn
                field="serviceName.nameLocalized"
                header-text="សេវាកម្ម"
                text-align="Left"
                :auto-fit="true"
              />
              <EColumn
                field="student.latin"
                header-text=""
                text-align="Left"
                width="80"
                :template="'profile'"
              >
                <template #profile="{ data }">
                  <NuxtImg
                    provider="cloudfront"
                    placeholder
                    class="w-[70px] h-[70px]"
                    :src="data?.student?.s3ProfileUri ?? S3_URI_IMAGE_PLACEHOLDER"
                    :modifiers="{
                      edits: {
                        resize: { width: 200, height: 200, fit: 'cover' },
                      },
                    }"
                  />
                </template>
              </EColumn>
              <EColumn
                field="student.name"
                header-text="ឈ្មោះសិស្ស"
                text-align="Left"
                width="170"
                :template="'studentName'"
              >
                <template #studentName="{ data }">
                  <div class="flex flex-col gap-y-2">
                    <div>
                      {{ data.student.name }}
                    </div>
                    <div>
                      {{ data.student.latin }}
                    </div>
                  </div>
                </template>
              </EColumn>
            </EColumns>
          </EjsGrid>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
