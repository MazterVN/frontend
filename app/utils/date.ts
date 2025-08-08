const dayjs = useDayjs()

export function toSQLDate(date: Date): string {
  const pattern = 'YYYY-MM-DD'
  const output = useDateFormat(date, pattern, { locales: 'en-US' })
  return output.value
}

export function timeFormat(time: string): string {
  return dayjs(time, 'HH:mm:ss').format('HH:mm')
}

export function getIsoWeekdays(startAt: string | Date, endAt: string | Date): number[] {
  const start = dayjs(startAt)
  const end = dayjs(endAt)
  const weekdaysSet = new Set<number>()

  let current = start
  while ((current.isBefore(end) || current.isSame(end, 'day')) && weekdaysSet.size < 7) {
    const isoWeekday = current.isoWeekday()
    weekdaysSet.add(isoWeekday)
    current = current.add(1, 'day')
  }

  return Array.from(weekdaysSet).sort()
}

export function dateRangeValue(range: [Date, Date] | null): [Date | string | null, Date | string | null] {
  try {
    return range ? [range[0], range[1]] : [null, null]
  }
  catch (error) {
    console.error('Error in dateRangeValue:', error)
    return [null, null]
  }
}
