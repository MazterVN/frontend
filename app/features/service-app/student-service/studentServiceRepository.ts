import type {
  CreateUpsertStudentServiceInput,
  CreateUpsertStudentServiceMutation,
  EditStudentServiceQuery,
} from '#gql'
import type { CreateStudentServiceTransferMutation, CreateStudentServiceTransferInput, ExportBioCheckListQuery, ExportCertificateOfEducationQuery, ExportNewStudentListQuery, ListStudentServiceWithAttendanceQuery, ListStudentServiceWithScoreQuery, StudentServiceExportStudentProfileQuery, BatchUpgradeStudentServiceInput, BatchUpgradeStudentServiceMutation, StudentServiceFillEnrollmentDraftQuery } from '#gql/default'
import type { StudentServiceService } from '#imports'

class StudentServiceRepository {
  private studentStudentService: StudentServiceService

  constructor(studentStudentService: StudentServiceService) {
    this.studentStudentService = studentStudentService
  }

  async edit(id: string): Promise<EditStudentServiceQuery | null> {
    return await this.studentStudentService.edit(id)
  }

  async fillEnrollmentDraft(studentServiceId: string): Promise<StudentServiceFillEnrollmentDraftQuery | null> {
    return await this.studentStudentService.fillEnrollmentDraft(studentServiceId)
  }

  async listWithAttendance(timetableId: string, filterDate: string): Promise<ListStudentServiceWithAttendanceQuery | null> {
    return await this.studentStudentService.listWithAttendance(timetableId, filterDate)
  }

  async listWithScore(subjectGroupingId: string, serviceDetailIds: string[], subjectGroupingDetailIds: string[], monthsOfYearId: string): Promise<ListStudentServiceWithScoreQuery | null> {
    return await this.studentStudentService.listWithScore(subjectGroupingId, serviceDetailIds, subjectGroupingDetailIds, monthsOfYearId)
  }

  async exportStudentProfile(serviceDetailIds: string[], studentServiceIds: string[]): Promise<StudentServiceExportStudentProfileQuery> {
    return await this.studentStudentService.exportStudentProfile(serviceDetailIds, studentServiceIds)
  }

  async exportNewStudentList(studentServiceIds: string[], serviceDetailIds: string[]): Promise<ExportNewStudentListQuery | null> {
    return await this.studentStudentService.exportNewStudentList(studentServiceIds, serviceDetailIds)
  }

  async exportBioCheckList(studyYearId: string, serviceDetailIds: string[], studentServiceIds: string[]): Promise<ExportBioCheckListQuery | null> {
    return await this.studentStudentService.exportBioCheckList(studyYearId, serviceDetailIds, studentServiceIds)
  }

  async exportCertificateOfEducation(studyYearId: string, serviceDetailIds: string[], studentServiceIds: string[]): Promise<ExportCertificateOfEducationQuery | null> {
    return await this.studentStudentService.exportCertificateOfEducation(studyYearId, serviceDetailIds, studentServiceIds)
  }

  async createUpsert(
    input: CreateUpsertStudentServiceInput,
  ): Promise<CreateUpsertStudentServiceMutation | null> {
    return await this.studentStudentService.createUpsert(input)
  }

  async createTransfer(input: CreateStudentServiceTransferInput): Promise<CreateStudentServiceTransferMutation | null> {
    return await this.studentStudentService.createTransfer(input)
  }

  async batchUpgrade(input: BatchUpgradeStudentServiceInput): Promise<BatchUpgradeStudentServiceMutation | null> {
    return await this.studentStudentService.batchUpgrade(input)
  }
}
export const studentServiceRepository = new StudentServiceRepository(studentServiceService)
