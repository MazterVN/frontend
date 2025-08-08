import type { StudentNoteReportService } from '#imports'
import type {
  GetStudentNoteReportQuery,
  GetStudentNoteReportQueryVariables,
} from '#gql'

class StudentNoteReportRepository {
  private service: StudentNoteReportService

  constructor(service: StudentNoteReportService) {
    this.service = service
  }

  async get(variables: GetStudentNoteReportQueryVariables): Promise<GetStudentNoteReportQuery | null> {
    return await this.service.get(variables)
  }
}

export const studentNoteReportRepository = new StudentNoteReportRepository(studentNoteReportService)
