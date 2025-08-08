<script setup lang="ts">
const store = useBuildingRoomStore()
const emit = defineEmits(['submit', 'error', 'close', 'init'])
const formRef = useTemplateRef('formRef')
emit('init')
</script>

<template>
  <BaseModal
    title="បន្ថែម"
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
      <div class="sm:col-span-2">
        <UFormField
          label="អាគារ"
          name="building"
        >
          <UInput
            v-model="store.item.building"
            data-testid="building"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-1">
        <UFormField
          label="ជាន់ទី"
          name="floor"
        >
          <UInput
            v-model="store.item.floor"
            data-testid="floor"
            type="number"
            min="0"
            max="50"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-3">
        <UFormField
          label="បន្ទប់លេខ"
          name="roomNo"
        >
          <UInput
            v-model="store.item.roomNo"
            data-testid="room-no"
          />
        </UFormField>
      </div>
      <div class="sm:col-span-full">
        <UFormField
          label="ប្លង់បន្ទប់"
        >
          <Table>
            <TableBody class="[&_td]:border">
              <TableRow
                v-for="row in store.rows"
                :key="row"
              >
                <TableCell
                  v-for="column in store.columns"
                  :key="`${row}-${column}`"
                  :data-testid="`cell-${row}-${column}`"
                  :class="[
                    'p-1',
                    'min-w-[50px]',
                    'h-[35px]',
                    store.selectedCellCSS(row, column),
                    'text-center',
                    'text-white',
                    'select-none',
                  ]"
                  @mousedown="store.onMouseDown(row, column)"
                  @mouseover="store.onMouseOver(row, column)"
                  @mouseup="store.onMouseUp"
                >
                  {{ store.getCellInfo(row, column) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </UFormField>
      </div>
    </UForm>
  </BaseModal>
</template>
