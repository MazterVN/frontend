<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useStudentServiceStore()
const logStore = useStudentServiceLogStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
const serviceId = ref<string | null>(null)
emit('init')

onUnmounted(() => logStore.setGridRef(null))
</script>

<template>
  <BaseModal
    title="Batch Upgrade"
    submit-title="រក្សាទុក"
    @close="() => emit('close')"
    @submit="() => formRef?.submit()"
  >
    <UForm
      ref="formRef"
      :schema="store.batchUpgradeValidationSchema"
      :state="store.batchUpgradeItem"
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div class="sm:col-span-2">
        <UFormField
          name="studyYearId"
          label="ឆ្នាំសិក្សា"
        >
          <DropdownList
            v-model="store.batchUpgradeItem.studyYearId"
            data-testid="study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"

            @change="interactedChanged($event, () => serviceId = null)"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.batchUpgradeItem.studyYearId"
          label="សេវាកម្ម"
        >
          <DropdownList
            v-model="serviceId"
            data-testid="service-id"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.batchUpgradeItem.studyYearId ?? null))"
            :enabled="!!store.batchUpgradeItem.studyYearId"
            :graphql-query="ListServiceDropdownDocument"
            :fields="{ text: 'name', value: 'id' }"
            @change="interactedChanged($event, () => store.batchUpgradeItem.serviceDetailId = '')"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="serviceId ?? ''"
          name="serviceDetailId"
          label="ឈ្មោះសេវាកម្ម"
        >
          <DropdownList
            v-model="store.batchUpgradeItem.serviceDetailId"
            data-testid="service-detail-id"
            :predicate="predicateMemoize(new Predicate('serviceId', 'equal', serviceId ?? null))"
            :enabled="!!serviceId"
            :graphql-query="ListServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="serviceTypeId"
          label="ប្រភេទសេវាកម្ម"
        >
          <DropdownList
            v-model="store.batchUpgradeItem.serviceTypeId"
            data-testid="service-type-id"
            :graphql-query="ListServiceTypeDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          name="shiftType"
          label="វេន"
        >
          <DropdownList
            v-model="store.batchUpgradeItem.shiftType"
            data-testid="shift-type"
            :graphql-query="ListLocalizedShiftTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          name="note"
          label="សំគាល់"
        >
          <UTextarea
            resize
            :model-value="store.batchUpgradeItem.note ?? ''"
            data-testid="note"
            @update:model-value="store.batchUpgradeItem.note = $event as string"
          />
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
