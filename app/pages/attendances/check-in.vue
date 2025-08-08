<script setup lang="ts">
const store = useAttendanceCheckInStore()
onUnmounted(() => {
  store.setGridRef(null)
  store.cleanup()
})
</script>

<template>
  <UCard
    class="w-full"
    :ui="{
      body: 'p-1',
      footer: 'p-2',
    }"
  >
    <div class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-6">
      <div class="sm:col-span-full">
        <UCard
          class="w-full"
          :ui="{
            body: '',
            footer: '!px-2 py-1',
            header: '!px-2 py-1',
          }"
        >
          <Table class="table-fixed">
            <TableHeader class="[&_th]:border-r [&_th]:h-8 [&_th]:pl-2 [&_th:last-child]:border-r-0">
              <TableRow>
                <TableHead class="w-[200px]">
                  ម៉ោង
                </TableHead>
                <TableHead class="w-[200px]">
                  ថ្នាក់
                </TableHead>
                <TableHead>
                  មុខវិជ្ជា
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="[&_td]:p-1 [&_td]:pl-2 [&_td]:border-r [&_td:last-child]:border-r-0">
              <TableRow
                v-for="timetable in store.timetables"
                :key="timetable.id"
                :class="{
                  '!bg-primary-500 !text-md-on-primary': store.selectedTimetableId === timetable.id,
                }"
              >
                <TableCell>
                  <div class="flex items-center gap-1">
                    <i class="icon-[heroicons--clock]" />
                    <span>{{ timeFormat(timetable.startTime) }} - {{ timeFormat(timetable.endTime) }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {{ timetable.serviceNameCalc }}
                </TableCell>
                <TableCell>
                  {{ timetable.subjectCalc }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </UCard>
      </div>
    </div>
    <div class="mt-2">
      <AttendanceCheckInGrid @update:grid-ref="store.setGridRef" />
    </div>
  </UCard>
</template>
