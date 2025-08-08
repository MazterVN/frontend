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
import { GqlCreateRelatedGradeScoreTemplate, GqlEditGradeScoreTemplate, GqlUpdateRelatedGradeScoreTemplate } from '#gql'
import type { ReportFormat } from '#gql/default'

export class GradeScoreTemplateService {
  async edit(id: string): Promise<EditGradeScoreTemplateQuery | null> {
    try {
      const data = await GqlEditGradeScoreTemplate({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedGradeScoreTemplateInput,
  ): Promise<CreateRelatedGradeScoreTemplateMutation | null> {
    try {
      const data = await GqlCreateRelatedGradeScoreTemplate({ input: input })
      showGqlMutationError(data.createRelatedGradeScoreTemplate.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedGradeScoreTemplateInput,
  ): Promise<UpdateRelatedGradeScoreTemplateMutation | null> {
    try {
      const data = await GqlUpdateRelatedGradeScoreTemplate({ id: id, input: input })
      showGqlMutationError(data.updateRelatedGradeScoreTemplate.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreSemesterList(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterListQuery | null> {
    try {
      const data = await GqlExportScoreSemesterList({ gradeScoreTemplateId: gradeScoreTemplateId, serviceDetailId: serviceDetailId, subjectGroupingId: subjectGroupingId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreSemesterListSummary(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string, format: ReportFormat): Promise<ExportScoreSemesterListSummaryQuery | null> {
    try {
      const data = await GqlExportScoreSemesterListSummary({ gradeScoreTemplateId: gradeScoreTemplateId, serviceDetailId: serviceDetailId, subjectGroupingId: subjectGroupingId, format: format })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreSemesterCertificate(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterCertificateQuery | null> {
    try {
      const data = await GqlExportScoreSemesterCertificate({ gradeScoreTemplateId: gradeScoreTemplateId, serviceDetailId: serviceDetailId, subjectGroupingId: subjectGroupingId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreSemesterCertificateFormal(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterCertificateFormalQuery | null> {
    try {
      const data = await GqlExportScoreSemesterCertificateFormal({ gradeScoreTemplateId: gradeScoreTemplateId, serviceDetailId: serviceDetailId, subjectGroupingId: subjectGroupingId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreSemesterTranscript(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterTranscriptQuery | null> {
    try {
      const data = await GqlExportScoreSemesterTranscript({ gradeScoreTemplateId: gradeScoreTemplateId, serviceDetailId: serviceDetailId, subjectGroupingId: subjectGroupingId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportScoreSemesterHonorList(gradeScoreTemplateId: string, serviceDetailId: string, subjectGroupingId: string): Promise<ExportScoreSemesterHonorListQuery | null> {
    try {
      const data = await GqlExportScoreSemesterHonorList({ gradeScoreTemplateId: gradeScoreTemplateId, serviceDetailId: serviceDetailId, subjectGroupingId: subjectGroupingId })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const gradeScoreTemplateService = new GradeScoreTemplateService()
