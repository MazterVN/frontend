import type { CreateRelatedGradeLevelInput, CreateRelatedGradeLevelMutation, EditGradeLevelQuery, UpdateRelatedGradeLevelInput, UpdateRelatedGradeLevelMutation } from '#gql'

export class GradeLevelService {
  async edit(id: string): Promise<EditGradeLevelQuery | null> {
    try {
      const data = await GqlEditGradeLevel({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedGradeLevelInput,
  ): Promise<CreateRelatedGradeLevelMutation | null> {
    try {
      const data = await GqlCreateRelatedGradeLevel({ input: input })
      showGqlMutationError(data.createRelatedGradeLevel.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedGradeLevelInput,
  ): Promise<UpdateRelatedGradeLevelMutation | null> {
    try {
      const data = await GqlUpdateRelatedGradeLevel({ id: id, input: input })
      showGqlMutationError(data.updateRelatedGradeLevel.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const gradeLevelService = new GradeLevelService()
