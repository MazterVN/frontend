<script setup lang="ts">
import type { MultiSelectModel } from '@syncfusion/ej2-vue-dropdowns'
import { useForwardPropsEmits } from 'reka-ui'
import type { Predicate } from '@syncfusion/ej2-data'
import { Query } from '@syncfusion/ej2-data'
import type { DocumentNode } from 'graphql'

export type Emits = {
  'modelchanged': [payload: string]
  'update:modelValue': [payload: string]
  'update:value': [payload: string]
}

const defaultConfig: MultiSelectModel = {
  query: new Query().take(35).requiresCount(),
  filterType: 'Contains',
  allowFiltering: true,
  floatLabelType: 'Never',
  showClearButton: true,
  showDropDownIcon: true,
}
const props = defineProps<MultiSelectModel & { graphqlQuery?: DocumentNode, predicate?: Predicate }>()
const emits = defineEmits<Emits>()
const forwarded = useForwardPropsEmits(props, emits)

const dataSource = computed(() => {
  if (props.graphqlQuery) {
    return gridDataSource(props.graphqlQuery)
  }
  return props.dataSource
})
const queryPredicate = computed(() => {
  if (props.predicate) {
    return new Query().take(35).requiresCount().where(props.predicate)
  }
  return props.query ? props.query : defaultConfig.query
})

const mergedConfig = computed(() => ({
  ...defaultConfig,
  ...forwarded.value,
  dataSource: dataSource.value,
  query: queryPredicate.value,
}))
</script>

<template>
  <EjsMultiSelect
    v-bind="mergedConfig"
    mode="CheckBox"
    :show-select-all="true"
  />
</template>
