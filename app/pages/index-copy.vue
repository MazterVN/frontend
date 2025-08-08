<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const state = reactive({
  studyYearId: null,
  genderTypeId: 'FEMALE',
  serviceTypeId: null,
  date: {
    startDate: null as Date | null,
    endDate: null as Date | null,
  },
  s3_bucket: null,
  s3_bucket_folder: null,
  md: '## hello',
})
const startDate = ref<Date>(new Date())
const endDate = ref<Date>(new Date())
const weekdays = computed(() => getIsoWeekdays(startDate.value, endDate.value))
</script>

<template>
  <div class="bg-md-surface-container p-10 rounded-xl">
    <UInput
      icon="i-heroicons-magnifying-glass-20-solid"
      size="lg"
      variant="none"
      :trailing="false"
      placeholder="ស្វែងរក..."
    />
    {{ weekdays }}
    <UCard v-bind="CARD_ACCORDION">
      <Accordion
        type="single"
        collapsible
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            Is it accessible?
          </AccordionTrigger>
          <AccordionContent>
            <a href="url">link text</a>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Is it accessible? hi
          </AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern. hi
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </UCard>
    <div class="flex flex-col gap-2">
      <ElDatePickerExtended
        v-model:start-at="startDate"
        v-model:end-at="endDate"
        type="daterange"
        :max-days="15"
      />
      <UCard
        class="w-full card-table"
        :ui="CARD_TABLE_UI"
      >
        <template #header>
          <UButton
            label="រក្សាទុក"
            color="neutral"
          >
            <template #leading>
              <i class="icon-[lucide--save]" />
            </template>
          </UButton>
        </template>
        <Table class="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>
                ម៉ោង
              </TableHead>
              <TableHead class="w-[40px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Hi
              </TableCell>
              <TableCell class="text-center">
                <TrashButton />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <template #footer>
          <div class="footer">
            <PlusButton />
          </div>
        </template>
      </UCard>

      <NuxtImg
        provider="cloudfront"
        placeholder
        class="w-20 h-20"
        src="s3://pks-bucket-prod/placeholder.png"
        :modifiers="{
          edits: {
            resize: { width: 200, height: 200, fit: 'cover' },
          },
        }"
      />
      <UTextarea v-model="state.md" />
      <DropdownList
        v-model="state.s3_bucket"
        :predicate="predicateMemoize(new Predicate('namespace', 'equal', 's3_bucket_type'))"
        placeholder="S3 Bucket"
        :graphql-query="ListLocalizedTypeDocument"
        :fields="{ text: 'text', value: 'valueUpper' }"
      />
      <DropdownList
        v-model="state.s3_bucket_folder"
        :predicate="predicateMemoize(new Predicate('namespace', 'equal', toSnakeCase(state.s3_bucket)))"
        :enabled="!!state.s3_bucket"
        placeholder="S3 Bucket Folder"
        :graphql-query="ListLocalizedTypeDocument"
        :fields="{ text: 'text', value: 'valueUpper' }"
      />
      <DropdownList
        id="study-years"
        v-model="state.studyYearId"
        data-testid="study-year"
        placeholder="ឆ្នាំសិក្សា"
        name="study-year"
        :graphql-query="ListStudyYearDropdownDocument"
        :fields="{ text: 'value', value: 'id' }"
      />
      <DropdownList
        id="gender-types"
        v-model="state.genderTypeId"
        data-testid="gender-type"
        placeholder="ភេទ"
        name="gender-type"
        :graphql-query="ListLocalizedGenderTypeDocument"
        :fields="{ text: 'text', value: 'valueUpper' }"
      />
      <DropdownList
        id="service-types"
        v-model="state.serviceTypeId"
        placeholder="ប្រភេទសេវាកម្ម"
        name="service-type"
        :graphql-query="ListLocalizedServiceTypesDocument"
        :fields="{ text: 'text', value: 'valueUpper' }"
      />
      <component :is="twIcon('icon-[heroicons--arrow-right-end-on-rectangle]')" />
    </div>
  </div>
</template>
