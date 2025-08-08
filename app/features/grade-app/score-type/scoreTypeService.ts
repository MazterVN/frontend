import type { CreateRelatedScoreTypeInput, CreateRelatedScoreTypeMutation, EditScoreTypeQuery, UpdateRelatedScoreTypeInput, UpdateRelatedScoreTypeMutation } from '#gql'

export class ScoreTypeService {
  async edit(id: string): Promise<EditScoreTypeQuery | null> {
    try {
      const data = await GqlEditScoreType({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedScoreTypeInput,
  ): Promise<CreateRelatedScoreTypeMutation | null> {
    try {
      const data = await GqlCreateRelatedScoreType({ input: input })
      showGqlMutationError(data.createRelatedScoreType.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedScoreTypeInput,
  ): Promise<UpdateRelatedScoreTypeMutation | null> {
    try {
      const data = await GqlUpdateRelatedScoreType({ id: id, input: input })
      showGqlMutationError(data.updateRelatedScoreType.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const scoreTypeService = new ScoreTypeService()
