import type {
  BatchUpdateRelatedStudentAttendanceInput,
  BatchUpdateRelatedStudentAttendanceMutation,
  ListTimetablesForEmployeeQuery,
  ReadStudentAttendanceWithGenerateQuery,
  UpdateRelatedStudentAttendanceInput,
  UpdateRelatedStudentAttendanceMutation,
} from '#gql'

export class AttendanceService {
  /**
   * Update student attendance record
   */
  async update(
    id: string,
    input: UpdateRelatedStudentAttendanceInput,
  ): Promise<UpdateRelatedStudentAttendanceMutation | null> {
    try {
      const data = await GqlUpdateRelatedStudentAttendance({ id, input })
      showGqlMutationError(data.updateRelatedStudentAttendance.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
      return null
    }
  }

  /**
   * Read student attendance with generated data
   */
  async readStudentAttendanceWithGenerate(
    startDate: string,
    endDate: string,
    timetableIds: string[],
    studentServiceIds: string[],
  ): Promise<ReadStudentAttendanceWithGenerateQuery | null> {
    try {
      const data = await GqlReadStudentAttendanceWithGenerate({
        startDate,
        endDate,
        timetableIds,
        studentServiceIds,
      })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
      return null
    }
  }

  /**
   * Batch update student attendance
   */
  async batchUpdate(input: BatchUpdateRelatedStudentAttendanceInput): Promise<BatchUpdateRelatedStudentAttendanceMutation | null> {
    try {
      const data = await GqlBatchUpdateRelatedStudentAttendance({ input })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
      return null
    }
  }

  /**
   * List timetables for employee
   */
  async listTimetablesForEmployee(employeeId: string, dayOfWeek: number): Promise<ListTimetablesForEmployeeQuery | null> {
    try {
      const data = await GqlListTimetablesForEmployee({ id: employeeId, dayOfWeek: dayOfWeek })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
      return null
    }
  }
}

export const attendanceService = new AttendanceService()
