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
import type { ReportFormat } from '#gql/default'
import type { SubjectGroupingService } from '#imports'

class SubjectGroupingRepository {
  private service: SubjectGroupingService

  constructor(service: SubjectGroupingService) {
    this.service = service
  }

  async edit(id: string): Promise<EditSubjectGroupingQuery | null> {
    return await this.service.edit(id)
  }

  async exportScoreMonthlyCertificate(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyCertificateQuery | null> {
    return await this.service.exportScoreMonthlyCertificate(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  }

  async exportScoreMonthlyTranscript(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyTranscriptQuery | null> {
    return await this.service.exportScoreMonthlyTranscript(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  }

  async exportScoreMonthlyRankingTable(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string, format: ReportFormat): Promise<ExportScoreMonthlyRankingTableQuery | null> {
    return await this.service.exportScoreMonthlyRankingTable(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId, format)
  }

  async exportScoreMonthlyCheckList(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyCheckListQuery | null> {
    return await this.service.exportScoreMonthlyCheckList(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  }

  async exportScoreMonthlyCheckListTemplate(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyCheckListTemplateQuery | null> {
    return await this.service.exportScoreMonthlyCheckListTemplate(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  }

  async exportScoreMonthlyHonorList(subjectGroupingId: string, studyYearId: string, serviceDetailIds: string[], monthsOfYearId: string): Promise<ExportScoreMonthlyHonorListQuery | null> {
    return await this.service.exportScoreMonthlyHonorList(subjectGroupingId, studyYearId, serviceDetailIds, monthsOfYearId)
  }

  async createRelated(
    input: CreateRelatedSubjectGroupingInput,
  ): Promise<CreateRelatedSubjectGroupingMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedSubjectGroupingInput,
  ): Promise<UpdateRelatedSubjectGroupingMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const subjectGroupingRepository = new SubjectGroupingRepository(subjectGroupingService)
