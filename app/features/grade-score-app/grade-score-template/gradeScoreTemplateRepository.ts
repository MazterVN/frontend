import { gradeScoreTemplateService, type GradeScoreTemplateService } from './gradeScoreTemplateService'
import type {
  CreateRelatedGradeScoreTemplateInput,
  CreateRelatedGradeScoreTemplateMutation,
  EditGradeScoreTemplateQuery,
  ExportScoreSemesterCertificateFormalQuery,
  ExportScoreSemesterCertificateQuery,
  ExportScoreSemesterHonorListQuery,
  ExportScoreSemesterListQuery,
  ExportScoreSemesterListSummaryQuery,
  ExportScoreSemesterTranscriptQuery,
  UpdateRelatedGradeScoreTemplateInput,
  UpdateRelatedGradeScoreTemplateMutation,
} from '#gql'
import type { ReportFormat } from '#gql/default'

class GradeScoreTemplateRepository {
  private service: GradeScoreTemplateService

  constructor(service: GradeScoreTemplateService) {
    this.service = service
  }

  async edit(id: string): Promise<EditGradeScoreTemplateQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedGradeScoreTemplateInput,
  ): Promise<CreateRelatedGradeScoreTemplateMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedGradeScoreTemplateInput,
  ): Promise<UpdateRelatedGradeScoreTemplateMutation | null> {
    return await this.service.updateRelated(id, input)
  }

  async exportScoreSemesterList(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterListQuery | null> {
    return await this.service.exportScoreSemesterList(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  }

  async exportScoreSemesterListSummary(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string, format: ReportFormat): Promise<ExportScoreSemesterListSummaryQuery | null> {
    return await this.service.exportScoreSemesterListSummary(gradeScoreTemplateId, serviceDetailId, subjectGroupingId, format)
  }

  async exportScoreSemesterCertificate(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterCertificateQuery | null> {
    return await this.service.exportScoreSemesterCertificate(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  }

  async exportScoreSemesterCertificateFormal(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterCertificateFormalQuery | null> {
    return await this.service.exportScoreSemesterCertificateFormal(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  }

  async exportScoreSemesterTranscript(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterTranscriptQuery | null> {
    return await this.service.exportScoreSemesterTranscript(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  }

  async exportScoreSemesterHonorList(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterHonorListQuery | null> {
    return await this.service.exportScoreSemesterHonorList(gradeScoreTemplateId, serviceDetailId, subjectGroupingId)
  }
}

export const gradeScoreTemplateRepository = new GradeScoreTemplateRepository(gradeScoreTemplateService)
