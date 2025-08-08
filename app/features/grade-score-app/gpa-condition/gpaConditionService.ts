import type {
  CreateRelatedGpaConditionInput,
  CreateRelatedGpaConditionMutation,
  EditGpaConditionQuery,
  UpdateRelatedGpaConditionInput,
  UpdateRelatedGpaConditionMutation,
} from '#gql'

export class GpaConditionService {
  async edit(id: string): Promise<EditGpaConditionQuery | null> {
    try {
      const data = await GqlEditGpaCondition({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedGpaConditionInput,
  ): Promise<CreateRelatedGpaConditionMutation | null> {
    try {
      const data = await GqlCreateRelatedGpaCondition({ input: input })
      showGqlMutationError(data.createRelatedGpaCondition.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedGpaConditionInput,
  ): Promise<UpdateRelatedGpaConditionMutation | null> {
    try {
      const data = await GqlUpdateRelatedGpaCondition({ id: id, input: input })
      showGqlMutationError(data.updateRelatedGpaCondition.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const gpaConditionService = new GpaConditionService()
