<script setup lang="ts">
import Home from './Home.vue'
import StudentParents from './StudentParents.vue'

const emit = defineEmits([
  'init',
  'submit',
  'error',
  'close',
])
const homeFormRef = ref<InstanceType<typeof Home> | null>(null)
const studentParentFormRef = ref<InstanceType<typeof StudentParents> | null>(null)
const studentAddressFormRef = ref<InstanceType<typeof StudentParents> | null>(null)

type Tab = 'home' | 'parents' | 'address' | 'service'
const selectedTab = ref<Tab>('home')
emit('init')
function handleFormSubmit() {
  switch (selectedTab.value) {
    case 'home':
      homeFormRef.value?.submit()
      break
    case 'parents':
      studentParentFormRef.value?.submit()
      break
    case 'address':
      studentAddressFormRef.value?.submit()
      break
    default:
      console.log('submit')
  }
}
</script>

<template>
  <BaseModal
    title="កែប្រែ"
    submit-title="រក្សាទុក"
    @close="() => emit('close')"
    @submit="handleFormSubmit"
  >
    <template #modal>
      <slot name="modal" />
    </template>
    <ElTabs
      v-model="selectedTab"
      type="border-card"
    >
      <ElTabPane
        label="ផ្ទាំងដើម"
        name="home"
      >
        <Home
          ref="homeFormRef"
          @on-error="emit('error', $event)"
          @submit="emit('submit', $event)"
        />
      </ElTabPane>
      <ElTabPane
        label="អាណាព្យាបាល"
        name="parents"
      >
        <StudentParents
          ref="studentParentFormRef"
          @on-error="emit('error', $event)"
          @submit="emit('submit', $event)"
        />
      </ElTabPane>
      <ElTabPane
        label="អាសយដ្ឋាន"
        name="address"
      >
        <StudentAddress
          ref="studentAddressFormRef"
          @on-error="emit('error', $event)"
          @submit="emit('submit', $event)"
        />
      </ElTabPane>
      <ElTabPane
        label="សេវាកម្ម"
        name="service"
      >
        <StudentService />
      </ElTabPane>
    </ElTabs>
  </BaseModal>
</template>
