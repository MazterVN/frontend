<script setup lang="ts">
import type { DropDownListModel } from '@syncfusion/ej2-vue-dropdowns'
import { useForwardPropsEmits } from 'reka-ui'
import type { Predicate } from '@syncfusion/ej2-data'
import { Query } from '@syncfusion/ej2-data'
import type { DocumentNode } from 'graphql'
import type { InputProps } from '@nuxt/ui'

export type Emits = {
  'modelchanged': [payload: string]
  'update:modelValue': [payload: string]
  'update:value': [payload: string]
}
interface Props extends DropDownListModel, InputProps {
  graphqlQuery?: DocumentNode
  predicate?: Predicate
}

const props = withDefaults(defineProps<Props>(), {
  query: () => new Query().take(100).requiresCount(),
  filterType: 'Contains',
  allowFiltering: true,
  floatLabelType: 'Never',
  showClearButton: true,
})

const { emitFormBlur } = useFormField<Props>(props, { deferInputValidation: true })
const emits = defineEmits<Emits>()
const forwarded = useForwardPropsEmits(props, emits)

const dataSource = computed(() => {
  return props.graphqlQuery ? gridDataSource(props.graphqlQuery) : props.dataSource
})
const queryPredicate = computed(() => {
  return props.predicate
    ? new Query().take(100).requiresCount().where(props.predicate)
    : props.query || new Query().take(100).requiresCount()
})

const mergedConfig = computed(() => ({
  ...forwarded.value,
  dataSource: dataSource.value,
  query: queryPredicate.value,
}))
</script>

<template>
  <EjsDropdownlist
    v-bind="mergedConfig"
    @blur="emitFormBlur"
  />
</template>
