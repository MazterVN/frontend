import type {
  CreateRelatedSubjectGroupingInput,
  CreateRelatedSubjectGroupingMutation,
  EditSubjectGroupingQuery,
  ExportScoreMonthlyCertificateQuery,
  ExportScoreMonthlyCheckListQuery,
  ExportScoreMonthlyCheckListTemplateQuery,
  ExportScoreMonthlyHonorListQuery,
  ExportScoreMonthlyRankingTableQuery,
  ExportScoreMonthlyTranscriptQuery,
  UpdateRelatedSubjectGroupingInput,
  UpdateRelatedSubjectGroupingMutation,
} from '#gql'
import { GqlCreateRelatedSubjectGrouping, GqlEditSubjectGrouping, GqlUpdateRelatedSubjectGrouping } from '#gql'
import type { ReportFormat } from '#gql/default'

export class SubjectGroupingService {
  async edit(id: string): Promise<EditSubjectGroupingQuery | null> {
    try {
      return await GqlEditSubjectGrouping({ id: id })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreMonthlyCertificate(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyCertificateQuery | null> {
    try {
      return await GqlExportScoreMonthlyCertificate({ subjectGroupingId: subjectGroupingId, studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, monthsOfYearId: monthsOfYearId })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreMonthlyTranscript(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyTranscriptQuery | null> {
    try {
      return await GqlExportScoreMonthlyTranscript({ subjectGroupingId: subjectGroupingId, studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, monthsOfYearId: monthsOfYearId })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreMonthlyRankingTable(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string, format: ReportFormat): Promise<ExportScoreMonthlyRankingTableQuery | null> {
    try {
      return await GqlExportScoreMonthlyRankingTable({ subjectGroupingId: subjectGroupingId, studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, monthsOfYearId: monthsOfYearId, format: format })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreMonthlyCheckList(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyCheckListQuery | null> {
    try {
      return await GqlExportScoreMonthlyCheckList({ subjectGroupingId: subjectGroupingId, studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, monthsOfYearId: monthsOfYearId })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreMonthlyCheckListTemplate(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyCheckListTemplateQuery | null> {
    try {
      return await GqlExportScoreMonthlyCheckListTemplate({ subjectGroupingId: subjectGroupingId, studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, monthsOfYearId: monthsOfYearId })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreMonthlyHonorList(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyHonorListQuery | null> {
    try {
      return await GqlExportScoreMonthlyHonorList({ subjectGroupingId: subjectGroupingId, studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, monthsOfYearId: monthsOfYearId })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedSubjectGroupingInput,
  ): Promise<CreateRelatedSubjectGroupingMutation | null> {
    try {
      const data = await GqlCreateRelatedSubjectGrouping({ input: input })
      showGqlMutationError(data.createRelatedSubjectGrouping.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedSubjectGroupingInput,
  ): Promise<UpdateRelatedSubjectGroupingMutation | null> {
    try {
      const data = await GqlUpdateRelatedSubjectGrouping({ id: id, input: input })
      showGqlMutationError(data.updateRelatedSubjectGrouping.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const subjectGroupingService = new SubjectGroupingService()
