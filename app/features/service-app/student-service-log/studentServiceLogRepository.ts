import type { StudentServiceLogService } from './studentServiceLogService'
import type {
  CreateRelatedUpsertStudentServiceLogInput,
  CreateRelatedUpsertStudentServiceLogMutation,
  EditStudentServiceLogQuery,
} from '#gql'

class StudentServiceLogRepository {
  private studentStudentServiceLog: StudentServiceLogService

  constructor(studentStudentServiceLog: StudentServiceLogService) {
    this.studentStudentServiceLog = studentStudentServiceLog
  }

  async edit(id: string): Promise<EditStudentServiceLogQuery> {
    return await this.studentStudentServiceLog.edit(id)
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertStudentServiceLogInput,
  ): Promise<CreateRelatedUpsertStudentServiceLogMutation | null> {
    return await this.studentStudentServiceLog.createRelatedUpsert(input)
  }
}
export const studentServiceLogRepository = new StudentServiceLogRepository(studentServiceLogService)
