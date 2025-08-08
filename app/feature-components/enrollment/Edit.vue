<script setup lang="ts">
import { Predicate } from '@syncfusion/ej2-data'

const store = useEnrollmentStore()
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
      class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12"
      @submit="(evt) => emit('submit', evt)"
      @error="(evt) => emit('error', evt)"
    >
      <div class="sm:col-span-2">
        <UFormField
          name="state"
          label="ស្ថានភាព"
        >
          <DropdownList
            v-model="store.item.state"
            data-testid="state"
            :graphql-query="ListEnrollmentStateTypeDocument"
            :fields="{ text: 'text', value: 'valueUpper' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-5">
        <UFormField
          name="sourceStudyYearId"
          label="ឆ្នាំសិក្សាប្រភព"
        >
          <DropdownList
            v-model="store.item.sourceStudyYearId"
            data-testid="source-study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @change="interactedChanged($event, (_event) => store.item.studentServiceId = '')"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-5">
        <UFormField
          name="destinationStudyYearId"
          label="ឆ្នាំសិក្សាគោលដៅ"
        >
          <DropdownList
            v-model="store.item.destinationStudyYearId"
            data-testid="destination-study-year-id"
            :graphql-query="ListStudyYearDropdownDocument"
            :fields="{ text: 'value', value: 'id' }"
            @change="interactedChanged($event, (_event) => store.item.enrollmentSettingDestinationId = '')"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-2">
        <UFormField
          name="buildingRoomSeatId"
          label="លេខតុ"
        >
          <DropdownList
            v-model="store.item.buildingRoomSeatId"
            data-testid="building-room-seat-id"
            :graphql-query="ListBuildingRoomSeatDropdownDocument"
            :fields="{ text: 'seatNo', value: 'id' }"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-5">
        <UFormField
          :key="store.item.sourceStudyYearId"
          name="studentServiceId"
          label="ថ្នាក់ប្រភព"
        >
          <DropdownList
            v-model="store.item.studentServiceId"
            data-testid="student-service-id"
            :graphql-query="ListStudentServiceDropdownDocument"
            :fields="{ text: 'withStudentCalc', value: 'id' }"
            :enabled="!!store.item.sourceStudyYearId"
            :predicate="predicateMemoize(new Predicate('studyYearId', 'equal', store.item.sourceStudyYearId))"
            @change="interactedChanged($event, (event) => store.studentServiceIdChanged(event))"
          />
        </UFormField>
      </div>

      <div class="sm:col-span-5">
        <UFormField
          :key="`${store.item.destinationStudyYearId}-${store.item.studentServiceId}-${!store.item.enrollmentSettingDestinationId}`"
          name="enrollmentSettingDestinationId"
          label="ថ្នាក់គោលដៅ"
        >
          <DropdownList
            v-model="store.item.enrollmentSettingDestinationId"
            data-testid="enrollment-setting-destination-id"
            :graphql-query="ListEnrollmentSettingDestinationDropdownDocument"
            :enabled="!!store.item.destinationStudyYearId && !!store.item.studentServiceId"
            :fields="{ text: 'destinationName', value: 'id' }"
            :predicate="predicateMemoize(Predicate.and([
              new Predicate('enrollmentSetting.destinationStudyYearId', 'equal', store.item.destinationStudyYearId),
              new Predicate('enrollmentSetting.enrollmentSettingSources.studentService.id', 'equal', store.item.studentServiceId),
            ]))"
          />
        </UFormField>
      </div>

      <!-- Student Information -->
      <div class="sm:col-span-full">
        <UFormField label="ពត៌មានសិស្ស">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[150px]">
                    គោត្តនាម-នាម
                  </TableHead>
                  <TableHead class="w-[200px]">
                    គោត្តនាម-នាមឡាតាំង
                  </TableHead>
                  <TableHead class="w-[150px]">
                    ថ្ងៃខែឆ្នាំកំណើត
                  </TableHead>
                  <TableHead class="w-[100px]">
                    ភេទ
                  </TableHead>
                  <TableHead>លេខទូរស័ព្ទ</TableHead>
                  <TableHead>អ៊ីម៉ែល</TableHead>
                  <TableHead>ហ្វេសបុក</TableHead>
                  <TableHead>ឡាញអាឌី</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(student, index) in store.item.enrollmentStudentDrafts"
                  :key="student.id"
                >
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.name`">
                      <UInput
                        v-model="student.name"
                        :data-testid="`student-name-${index}`"
                        :readonly="!student.nameEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.latin`">
                      <UInput
                        v-model="student.latin"
                        :data-testid="`student-latin-${index}`"
                        :readonly="!student.latinEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.dob`">
                      <ElDatePickerExtended
                        v-model="student.dob"
                        :data-testid="`student-dob-${index}`"
                        type="date"
                        format="DD/MM/YYYY"
                        value-format="YYYY-MM-DD"
                        :readonly="!student.dobEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.gender`">
                      <DropdownList
                        v-model="student.gender"
                        :data-testid="`student-gender-${index}`"
                        :graphql-query="ListLocalizedGenderTypeDocument"
                        :fields="{ text: 'text', value: 'valueUpper' }"
                        :readonly="!student.genderEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.tel`">
                      <UInput
                        v-model="student.tel"
                        :data-testid="`student-tel-${index}`"
                        :readonly="!student.telEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.email`">
                      <UInput
                        :model-value="student.email ?? ''"
                        :data-testid="`student-email-${index}`"
                        type="email"
                        :readonly="!student.emailEditable"
                        @update:model-value="student.email = $event as string"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.facebook`">
                      <UInput
                        :model-value="student.facebook ?? ''"
                        :data-testid="`student-facebook-${index}`"
                        :readonly="!student.facebookEditable"
                        @update:model-value="student.facebook = $event as string"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentStudentDrafts.${index}.lineId`">
                      <UInput
                        :model-value="student.lineId ?? ''"
                        :data-testid="`student-line-id-${index}`"
                        :readonly="!student.lineIdEditable"
                        @update:model-value="student.lineId = $event as string"
                      />
                    </UFormField>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </UCard>
        </UFormField>
      </div>

      <!-- Address Information -->
      <div class="sm:col-span-full">
        <UFormField label="ពត៌មានអាសយដ្ឋាន">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[200px]">
                    ប្រភេទ
                  </TableHead>
                  <TableHead>អាសយដ្ឋាន</TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(address, index) in store.item.enrollmentAddressDrafts"
                  :key="address.id"
                >
                  <TableCell>
                    <UFormField :name="`enrollmentAddressDrafts.${index}.type`">
                      <DropdownList
                        v-model="address.type"
                        :data-testid="`address-type-${index}`"
                        :graphql-query="ListLocalizedAddressTypeDocument"
                        :fields="{ text: 'text', value: 'valueUpper' }"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentAddressDrafts.${index}.villageId`">
                      <DropdownList
                        v-model="address.villageId"
                        :data-testid="`address-village-id-${index}`"
                        :graphql-query="ListVillageDropdownDocument"
                        :fields="{ text: 'addressName', value: 'id' }"
                        :readonly="!address.villageIdEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`address-trash-${index}`"
                      @click="store.removeAddressDraft(address.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-address"
                  @click="store.addAddressDraft"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>

      <!-- Parent Information -->
      <div class="sm:col-span-full">
        <UFormField label="ពត៌មានអាណាព្យាបាល">
          <UCard
            class="w-full card-table"
            :ui="CARD_TABLE_UI"
          >
            <Table class="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead class="w-[150px]">
                    ប្រភេទ
                  </TableHead>
                  <TableHead>គោត្តនាម-នាម</TableHead>
                  <TableHead>គោត្តនាម-នាមឡាតាំង</TableHead>
                  <TableHead>មុខរបរ</TableHead>
                  <TableHead>លេខទូរស័ព្ទ</TableHead>
                  <TableHead class="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow
                  v-for="(parent, index) in store.item.enrollmentParentDrafts"
                  :key="parent.id"
                >
                  <TableCell>
                    <UFormField :name="`enrollmentParentDrafts.${index}.type`">
                      <DropdownList
                        v-model="parent.type"
                        :data-testid="`parent-type-${index}`"
                        :graphql-query="ListLocalizedParentTypeDocument"
                        :fields="{ text: 'text', value: 'valueUpper' }"
                        :readonly="!parent.typeEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentParentDrafts.${index}.name`">
                      <UInput
                        v-model="parent.name"
                        :data-testid="`parent-name-${index}`"
                        :readonly="!parent.nameEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentParentDrafts.${index}.latin`">
                      <UInput
                        v-model="parent.latin"
                        :data-testid="`parent-latin-${index}`"
                        :readonly="!parent.latinEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentParentDrafts.${index}.job`">
                      <DropdownList
                        v-model="parent.job"
                        :data-testid="`parent-job-${index}`"
                        :graphql-query="ListLocalizedJobTypeDocument"
                        :fields="{ text: 'text', value: 'valueUpper' }"
                        :readonly="!parent.jobEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell>
                    <UFormField :name="`enrollmentParentDrafts.${index}.tel`">
                      <UInput
                        v-model="parent.tel"
                        :data-testid="`parent-tel-${index}`"
                        :readonly="!parent.telEditable"
                      />
                    </UFormField>
                  </TableCell>
                  <TableCell class="text-center">
                    <TrashButton
                      :data-testid="`parent-trash-${index}`"
                      @click="store.removeParentDraft(parent.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="footer">
                <PlusButton
                  data-testid="add-parent"
                  @click="store.addParentDraft"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>

      <!-- Payment Attachments -->
      <div class="sm:col-span-full">
        <UFormField label="ឯកសារភស្តុតាងបង់លុយ">
          <UCard
            class="w-full"
            :ui="{
              body: '',
              footer: '!px-2 py-1',
              header: '!px-2 py-1',
            }"
          >
            <Table class="table-fixed">
              <TableHeader
                class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0"
              >
                <TableRow>
                  <TableHead> ឯកសារ </TableHead>
                  <TableHead class="w-[200px]">
                    សំគាល់
                  </TableHead>
                  <TableHead class="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody
                class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0"
              >
                <TableRow
                  v-for="(attachment, index) in store.item.enrollmentPaymentAttachments"
                  :key="attachment.id"
                >
                  <TableCell>
                    <UButton
                      class="w-full"
                      variant="ghost"
                      size="sm"
                      color="neutral"
                      :data-testid="`attachment-${index}`"
                      @click="store.attachFile(attachment.id)"
                    >
                      <i
                        v-if="!attachment.key"
                        class="icon-[heroicons--paper-clip]"
                      />
                      <div
                        v-else
                        class="text-right truncate"
                        dir="rtl"
                      >
                        {{ getFileNameFromS3URI(attachment.key) || "......" }}
                      </div>
                    </UButton>
                  </TableCell>
                  <TableCell>
                    <UInput
                      :model-value="attachment.note ?? ''"
                      :data-testid="`attachment-note-${index}`"
                      placeholder="ABA..."
                      @update:model-value="attachment.note = $event as string"
                    />
                  </TableCell>
                  <TableCell>
                    <TrashButton
                      :data-testid="`attachment-trash-${index}`"
                      @click="store.removePaymentAttachment(attachment.id)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <template #footer>
              <div class="flex justify-end">
                <PlusButton
                  data-testid="add-attachment"
                  @click="store.addPaymentAttachment"
                />
              </div>
            </template>
          </UCard>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
