import type {
  BatchUpdateRelatedStudentAttendanceInput,
  BatchUpdateRelatedStudentAttendanceMutation,
  ListStudentServiceWithAttendanceQuery,
  ListTimetablesForEmployeeQuery,
  ReadStudentAttendanceWithGenerateQuery,
  UpdateRelatedStudentAttendanceInput,
  UpdateRelatedStudentAttendanceMutation,
} from '#gql'
import type { AttendanceService, StudentServiceService } from '#imports'

class AttendanceRepository {
  constructor(
    private readonly studentServiceService: StudentServiceService,
    private readonly service: AttendanceService,
  ) {}

  /**
   * List student services with their attendance records
   */
  async listStudentServiceWithAttendance(
    timetableId: string,
    filterDate: string,
  ): Promise<ListStudentServiceWithAttendanceQuery | null> {
    return await this.studentServiceService.listWithAttendance(
      timetableId,
      filterDate,
    )
  }

  /**
   * Update a student's attendance record
   */
  async update(
    id: string,
    input: UpdateRelatedStudentAttendanceInput,
  ): Promise<UpdateRelatedStudentAttendanceMutation | null> {
    return await this.service.update(id, input)
  }

  /**
   * Read attendance records with generated data for a date range
   */
  async readStudentAttendanceWithGenerate(
    startDate: string,
    endDate: string,
    timetableIds: string[],
    studentServiceIds: string[],
  ): Promise<ReadStudentAttendanceWithGenerateQuery | null> {
    return await this.service.readStudentAttendanceWithGenerate(
      startDate,
      endDate,
      timetableIds,
      studentServiceIds,
    )
  }

  /**
   * Batch update student attendance
   */
  async batchUpdate(input: BatchUpdateRelatedStudentAttendanceInput): Promise<BatchUpdateRelatedStudentAttendanceMutation | null> {
    return await this.service.batchUpdate(input)
  }

  /**
   * List timetables for employee
   */
  async listTimetablesForEmployee(employeeId: string, dayOfWeek: number): Promise<ListTimetablesForEmployeeQuery | null> {
    return await this.service.listTimetablesForEmployee(employeeId, dayOfWeek)
  }
}

// Singleton instance
export const attendanceRepository = new AttendanceRepository(
  studentServiceService,
  attendanceService,
)
