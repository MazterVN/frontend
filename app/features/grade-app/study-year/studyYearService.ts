import type { CreateRelatedStudyYearInput, CreateRelatedStudyYearMutation, EditStudyYearQuery, UpdateRelatedStudyYearInput, UpdateRelatedStudyYearMutation } from '#gql'

export class StudyYearService {
  async edit(id: string): Promise<EditStudyYearQuery | null> {
    try {
      const data = await GqlEditStudyYear({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedStudyYearInput,
  ): Promise<CreateRelatedStudyYearMutation | null> {
    try {
      const data = await GqlCreateRelatedStudyYear({ input: input })
      showGqlMutationError(data.createRelatedStudyYear.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedStudyYearInput,
  ): Promise<UpdateRelatedStudyYearMutation | null> {
    try {
      const data = await GqlUpdateRelatedStudyYear({ id: id, input: input })
      showGqlMutationError(data.updateRelatedStudyYear.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studyYearService = new StudyYearService()
