<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useStudentServiceStore()
const logStore = useStudentServiceLogStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')

onUnmounted(() => logStore.setGridRef(null))
</script>

<template>
  <BaseModal
    title="កែប្រែ"
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
      <div class="sm:col-span-1">
        <UFormField
          name="isActive"
          label="Active?"
        >
          <UCheckbox
            :model-value="store.item.isActive ?? false"
            data-testid="is-active"
            @update:model-value="store.item.isActive = $event as boolean"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-2">
        <UFormField
          :key="`${store.item.id}-study-year-id`"
          name="studyYearId"
          label="ឆ្នាំសិក្សា"
        >
          <DropdownList
            id="study-year-id"
            v-model="store.item.studyYearId"
            data-testid="study-year-id"
            :enabled="store.item.allowEdit ?? false"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"

            @update:model-value="store.item.serviceDetail.serviceId = ''"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.item.studyYearId"
          name="serviceDetail.serviceId"
          label="សេវាកម្ម"
        >
          <DropdownList
            id="service-detail-service-id"
            v-model="store.item.serviceDetail.serviceId"
            data-testid="service-detail-service-id"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.item.studyYearId ?? null))"
            :enabled="(store.item.allowEdit ?? false) && !!store.item.studyYearId"
            :graphql-query="ListServiceDropdownDocument"
            :fields="{ text: 'name', value: 'id' }"

            @update:model-value="store.item.serviceDetailId = ''"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="store.item.serviceDetail.serviceId ?? 'service-detail-id'"
          name="serviceDetailId"
          label="ឈ្មោះសេវាកម្ម"
        >
          <DropdownList
            id="service-detail-id"
            v-model="store.item.serviceDetailId"
            data-testid="service-detail-id"
            :predicate="predicateMemoize(new Predicate('serviceId', 'equal', store.item.serviceDetail.serviceId ?? null))"
            :enabled="(store.item.allowEdit ?? false) && !!store.item.serviceDetail.serviceId"
            :graphql-query="ListServiceDetailDropdownDocument"
            :fields="{ text: 'serviceNameCalc', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`${store.item.id}-service-type-id`"
          name="serviceTypeId"
          label="ប្រភេទសេវាកម្ម"
        >
          <DropdownList
            id="service-type-id"
            v-model="store.item.serviceTypeId"
            data-testid="service-type-id"
            :graphql-query="ListServiceTypeDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          :key="`${store.item.id}-shift-type`"
          name="shiftType"
          label="វេន"
        >
          <DropdownList
            id="shift-type"
            v-model="store.item.shiftType"
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
            :model-value="store.item.note ?? ''"
            data-testid="note"
            @update:model-value="store.item.note = $event as string"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          label="កំណត់ត្រាប្រភេទសេវាកម្ម"
        >
          <EjsGrid
            v-bind="store.logStoreGridConfig"
            id="grid-student-service-logs"
            :ref="logStore.setGridRef"
            height="300"
            :toolbar="logStore.gridToolbar"
            :row-selected="logStore.handleRowSelect"
            :row-deselected="logStore.handleRowDeselect"
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
                field="typeValue"
                header-text="ប្រភេទ"
                text-align="Left"
                :auto-fit="true"
                :allow-searching="false"
              />
              <EColumn
                field="date"
                header-text="ថ្ងៃខែឆ្នាំ"
                text-align="Left"
                :auto-fit="true"
                format="dd/MM/yyyy"
                type="date"
                :allow-searching="false"
              />
              <EColumn
                field="calcName"
                header-text="មូលហេតុ"
                text-align="Left"
                :allow-searching="false"
                :allow-sorting="false"
              />
            </EColumns>
          </EjsGrid>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
