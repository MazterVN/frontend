export const DATE_RANGE_WEEK_PRESETS = () => {
  const { t } = useI18n()
  const dayjs = useDayjs()
  return [
    {
      text: t('today'),
      value: () => {
        const end = dayjs()
        const start = dayjs()
        return [start, end]
      },
    },
    {
      text: t('thisWeek'),
      value: () => {
        const end = dayjs().isoWeekday(7)
        const start = dayjs().isoWeekday(1)
        return [start, end]
      },
    },
    {
      text: t('lastWeek'),
      value: () => {
        const end = dayjs().subtract(1, 'week').isoWeekday(7)
        const start = dayjs().subtract(1, 'week').isoWeekday(1)
        return [start, end]
      },
    },
  ]
}
export const DATE_RANGE_PRESETS = () => {
  const { t } = useI18n()
  const dayjs = useDayjs()
  return [
    {
      text: t('today'),
      value: () => {
        const end = dayjs()
        const start = dayjs()
        return [start, end]
      },
    },
    {
      text: t('thisWeek'),
      value: () => {
        const end = dayjs().isoWeekday(7)
        const start = dayjs().isoWeekday(1)
        return [start, end]
      },
    },
    {
      text: t('lastWeek'),
      value: () => {
        const end = dayjs().subtract(1, 'week').isoWeekday(7)
        const start = dayjs().subtract(1, 'week').isoWeekday(1)
        return [start, end]
      },
    },
    {
      text: t('thisMonth'),
      value: () => {
        const end = dayjs().endOf('month')
        const start = dayjs().startOf('month')
        return [start, end]
      },
    },
    {
      text: t('lastMonth'),
      value: () => {
        const end = dayjs().subtract(1, 'month').endOf('month')
        const start = dayjs().subtract(1, 'month').startOf('month')
        return [start, end]
      },
    },
    {
      text: t('thisYear'),
      value: () => {
        const end = dayjs().endOf('year')
        const start = dayjs().startOf('year')
        return [start, end]
      },
    },
    {
      text: t('lastYear'),
      value: () => {
        const end = dayjs().subtract(1, 'year').endOf('year')
        const start = dayjs().subtract(1, 'year').startOf('year')
        return [start, end]
      },
    },
  ]
}

export const CARD_TABLE_UI: object = {
  body: {
    padding: '',
  },
  footer: '!px-2 py-1',
  header: '!px-2 py-1',
}

export const CARD_ACCORDION: object = {
  class: 'w-full accordion-card',
  ui: {
    body: {
      padding: '!p-2 !py-0',
    },
    footer: '!px-2 py-1',
    header: '!px-2 py-1',
  },
}
