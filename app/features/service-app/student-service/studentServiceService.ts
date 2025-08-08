import type {
  CreateUpsertStudentServiceInput,
  CreateUpsertStudentServiceMutation,
  EditStudentServiceQuery,
} from '#gql'
import type { BatchUpgradeStudentServiceInput, BatchUpgradeStudentServiceMutation, CreateStudentServiceTransferInput, CreateStudentServiceTransferMutation, ExportBioCheckListQuery, ExportCertificateOfEducationQuery, ExportNewStudentListQuery, ListStudentServiceWithAttendanceQuery, ListStudentServiceWithScoreQuery, StudentServiceExportStudentProfileQuery, StudentServiceFillEnrollmentDraftQuery } from '#gql/default'

export class StudentServiceService {
  async edit(id: string): Promise<EditStudentServiceQuery | null> {
    try {
      const data = await GqlEditStudentService({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async fillEnrollmentDraft(studentServiceId: string): Promise<StudentServiceFillEnrollmentDraftQuery | null> {
    try {
      const data = await GqlStudentServiceFillEnrollmentDraft({ studentServiceId: studentServiceId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async listWithAttendance(timetableId: string, filterDate: string): Promise<ListStudentServiceWithAttendanceQuery | null> {
    try {
      const data = await GqlListStudentServiceWithAttendance({ timetableId: timetableId, filterDate: filterDate })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async listWithScore(subjectGroupingId: string, serviceDetailIds: string[], subjectGroupingDetailIds: string[], monthsOfYearId: string): Promise<ListStudentServiceWithScoreQuery | null> {
    try {
      const data = await GqlListStudentServiceWithScore({ subjectGroupingId: subjectGroupingId, serviceDetailIds: serviceDetailIds, subjectGroupingDetailIds: subjectGroupingDetailIds, monthsOfYearId: monthsOfYearId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportStudentProfile(serviceDetailIds: string[], studentServiceIds: string[]): Promise<StudentServiceExportStudentProfileQuery> {
    return await GqlStudentServiceExportStudentProfile({ serviceDetailIds: serviceDetailIds, studentServiceIds: studentServiceIds })
  }

  async exportNewStudentList(studentServiceIds: string[], serviceDetailIds: string[]): Promise<ExportNewStudentListQuery | null> {
    try {
      const data = await GqlExportNewStudentList({ studentServiceIds, serviceDetailIds })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportBioCheckList(studyYearId: string, serviceDetailIds: string[], studentServiceIds: string[]): Promise<ExportBioCheckListQuery | null> {
    try {
      const data = await GqlExportBioCheckList({ studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, studentServiceIds: studentServiceIds })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportCertificateOfEducation(studyYearId: string, serviceDetailIds: string[], studentServiceIds: string[]): Promise<ExportCertificateOfEducationQuery | null> {
    try {
      const data = await GqlExportCertificateOfEducation({ studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, studentServiceIds: studentServiceIds })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createUpsert(
    input: CreateUpsertStudentServiceInput,
  ): Promise<CreateUpsertStudentServiceMutation | null> {
    try {
      const data = await GqlCreateUpsertStudentService({ input: input })
      showGqlMutationError(data.createUpsertStudentService.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createTransfer(input: CreateStudentServiceTransferInput): Promise<CreateStudentServiceTransferMutation | null> {
    try {
      const data = await GqlCreateStudentServiceTransfer({ input: input })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async batchUpgrade(input: BatchUpgradeStudentServiceInput): Promise<BatchUpgradeStudentServiceMutation | null> {
    try {
      const data = await GqlBatchUpgradeStudentService({ input: input })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studentServiceService = new StudentServiceService()
