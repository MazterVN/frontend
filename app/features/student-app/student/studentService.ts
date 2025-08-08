import type { CreateRelatedStudentInput, CreateRelatedStudentMutation, EditStudentQuery, ExportNewStudentInfoQuery, ExportStudentCardFiveFourByEightyFiveMmQuery, ExportStudentCardSixSixByNineSevenMmQuery, ListStudentParentsByStudentQuery, UpdateRelatedStudentInput, UpdateRelatedStudentMutation } from '#gql'

export class StudentService {
  async edit(id: string): Promise<EditStudentQuery | null> {
    try {
      return await GqlEditStudent({ id: id })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async listStudentParents(studentId: string): Promise<ListStudentParentsByStudentQuery> {
    return await GqlListStudentParentsByStudent({ studentId: studentId })
  }

  async createRelated(
    input: CreateRelatedStudentInput,
  ): Promise<CreateRelatedStudentMutation | null> {
    try {
      const data = await GqlCreateRelatedStudent({ input: input })
      showGqlMutationError(data.createRelatedStudent.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedStudentInput,
  ): Promise<UpdateRelatedStudentMutation | null> {
    try {
      const data = await GqlUpdateRelatedStudent({ id: id, input: input })
      showGqlMutationError(data.updateRelatedStudent.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportStudentCardSixSixByNineSevenMm(
    studyYearId: string,
    serviceDetailIds: string[],
    studentIds: string[],
  ): Promise<ExportStudentCardSixSixByNineSevenMmQuery | null> {
    try {
      return await GqlExportStudentCardSixSixByNineSevenMm({
        studyYearId: studyYearId,
        serviceDetailIds: serviceDetailIds,
        studentIds: studentIds,
      })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportStudentCardFiveFourByEightyFiveMm(
    studyYearId: string,
    serviceDetailIds: string[],
    studentIds: string[],
  ): Promise<ExportStudentCardFiveFourByEightyFiveMmQuery | null> {
    try {
      return await GqlExportStudentCardFiveFourByEightyFiveMm({
        studyYearId: studyYearId,
        serviceDetailIds: serviceDetailIds,
        studentIds: studentIds,
      })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async exportNewStudentInfo(
    studyYearId: string,
    serviceDetailIds: string[],
    studentIds: string[],
  ): Promise<ExportNewStudentInfoQuery | null> {
    try {
      return await GqlExportNewStudentInfo({ studyYearId: studyYearId, serviceDetailIds: serviceDetailIds, studentIds: studentIds })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studentService = new StudentService()
