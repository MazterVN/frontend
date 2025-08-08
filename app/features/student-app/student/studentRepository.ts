import type { StudentService } from './studentService'
import type {
  CreateRelatedStudentInput,
  CreateRelatedStudentMutation,
  EditStudentQuery,
  ExportNewStudentInfoQuery,
  ExportStudentCardFiveFourByEightyFiveMmQuery,
  ExportStudentCardSixSixByNineSevenMmQuery,
  ListStudentParentsByStudentQuery,
  UpdateRelatedStudentInput,
  UpdateRelatedStudentMutation,
} from '#gql'

class StudentRepository {
  private service: StudentService

  constructor(service: StudentService) {
    this.service = service
  }

  async edit(id: string): Promise<EditStudentQuery | null> {
    return await this.service.edit(id)
  }

  async listStudentParents(studentId: string): Promise<ListStudentParentsByStudentQuery> {
    return await this.service.listStudentParents(studentId)
  }

  async createRelated(
    input: CreateRelatedStudentInput,
  ): Promise<CreateRelatedStudentMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedStudentInput,
  ): Promise<UpdateRelatedStudentMutation | null> {
    return await this.service.updateRelated(id, input)
  }

  async exportStudentCardSixSixByNineSevenMm(
    studyYearId: string,
    serviceDetailIds: string[],
    studentIds: string[],
  ): Promise<ExportStudentCardSixSixByNineSevenMmQuery | null> {
    return await this.service.exportStudentCardSixSixByNineSevenMm(studyYearId, serviceDetailIds, studentIds)
  }

  async exportStudentCardFiveFourByEightyFiveMm(
    studyYearId: string,
    serviceDetailIds: string[],
    studentIds: string[],
  ): Promise<ExportStudentCardFiveFourByEightyFiveMmQuery | null> {
    return await this.service.exportStudentCardFiveFourByEightyFiveMm(studyYearId, serviceDetailIds, studentIds)
  }

  async exportNewStudentInfo(
    studyYearId: string,
    serviceDetailIds: string[],
    studentIds: string[],
  ): Promise<ExportNewStudentInfoQuery | null> {
    return await this.service.exportNewStudentInfo(studyYearId, serviceDetailIds, studentIds)
  }
}
export const studentRepository = new StudentRepository(studentService)
