<script setup lang="ts">
import type { InputProps } from '@nuxt/ui'

const { t } = useI18n()

const dayjs = useDayjs()
const emit = defineEmits(['update:modelValue', 'update:startAt', 'update:endAt', 'change'])

// Define valid range picker types
const inRangeTypes = ['daterange', 'datetimerange', 'monthrange', 'yearrange'] as const

// Types that don't require UTC conversion
const localDateTypes = ['date', 'dates', 'daterange'] as const satisfies DatePickerType[]
type RangeType = typeof inRangeTypes[number]
type LocalDateType = typeof localDateTypes[number]

interface Props extends InputProps {
  modelValue?: DateModelValueType
  format?: string
  valueFormat?: string
  type?: DatePickerType
  maxDays?: number
  startAt?: DateModelType
  endAt?: DateModelType
}

const props = withDefaults(defineProps<Props>(), {
  format: 'ddd, DD/MM/YYYY',
  valueFormat: 'YYYY-MM-DD',
  type: 'date',
})

const { emitFormBlur } = useFormField<Props>(props, { deferInputValidation: true })

// Check if current type is a range picker
const isInRange = computed(() => inRangeTypes.includes(props.type as RangeType))

// Hndle model value updates with range validation
const updateModelValue = (value: DateModelValueType | undefined) => {
  // Handle clearing the date range
  if (!value) {
    emit('update:modelValue', null)
    emit('update:startAt', null)
    emit('update:endAt', null)
    return
  }

  // Handle single DateModelType
  if (!isInRange.value) {
    const formattedValue = dayjs(value as DateModelType)
      .utc(localDateTypes.includes(props.type as LocalDateType))
      .format(props.valueFormat)
    emit('update:modelValue', formattedValue)
    return
  }

  // Extract start and end dates from value
  const [startDate, endDate] = value as [DateModelType, DateModelType]

  // Initialize adjusted end date
  let adjustedEndDate = endDate

  // Validate and adjust date range if maxDays is set
  if (startDate && endDate && props.maxDays) {
    // Calculate number of days between start and end (+1 to include both dates)
    const numberOfDays = dayjs(endDate).diff(dayjs(startDate), 'day') + 1

    // If range exceeds maxDays, adjust end date to maximum allowed
    if (numberOfDays > props.maxDays) {
      adjustedEndDate = dayjs(startDate)
        .add(props.maxDays - 1, 'day')
        .format()
    }
  }
  // Emit updated values
  const utcStartAt = dayjs(startDate)
    .utc(localDateTypes.includes(props.type as LocalDateType))
    .format(props.valueFormat)
  const utcEndAt = dayjs(adjustedEndDate)
    .utc(localDateTypes.includes(props.type as LocalDateType))
    .format(props.valueFormat)

  emit('update:modelValue', [utcStartAt, utcEndAt])
  emit('update:startAt', utcStartAt)
  emit('update:endAt', utcEndAt)
}

// Computed model value with proper formatting
const computedModelValue = computed<DateModelValueType | undefined>({
  get() {
    if (props.modelValue === undefined) {
      if (!isInRange.value) return undefined

      return [
        props.startAt,
        props.endAt,
      ] as DateModelValueType
    }

    if (isInRange.value) {
      const range = props.modelValue as [DateModelType, DateModelType]
      return [
        range?.[0] ?? null,
        range?.[1] ?? null,
      ] as DateModelValueType
    }

    return props.modelValue
  },
  set: updateModelValue,
})

// Max days validation
const computedMaxDays = computed(() => props.maxDays ?? 0)

// Focus tracking for date selection
const focusStart = ref<Date[]>([])

// Date validation logic
const disabledDate = (date: Date) => {
  if (!props.maxDays || !isInRange.value) return false

  const focusedStartAt = focusStart.value[0]
  if (!focusedStartAt) return false

  const dateUnix = dayjs(date).unix()
  const maxFuture = dayjs(focusedStartAt).add(computedMaxDays.value, 'day').unix()
  const maxPast = dayjs(focusedStartAt).add(-computedMaxDays.value, 'day').unix()

  return dateUnix >= maxFuture || dateUnix <= maxPast
}

// Event handlers
const calendarChange = (dates: Date[]) => {
  if (dates[0]) focusStart.value = dates
}

const visibleChange = (_visible: boolean) => {
  focusStart.value = []
}
</script>

<template>
  <ElDatePicker
    v-model="computedModelValue"
    class="!w-full"
    :type="type"
    unlink-panels
    range-separator="-"
    :start-placeholder="t('startDate')"
    :end-placeholder="t('endDate')"
    :format="format"
    :shortcuts="isInRange && maxDays ? DATE_RANGE_WEEK_PRESETS() : !isInRange ? [] : DATE_RANGE_PRESETS()"
    :disabled-date="disabledDate"
    @calendar-change="calendarChange"
    @visible-change="visibleChange"
    @change="(value: DateModelValueType) => emit('change', value)"
    @blur="emitFormBlur"
  />
</template>
