import type { CreateRelatedRegisterReasonInput, CreateRelatedRegisterReasonMutation, EditRegisterReasonQuery, UpdateRelatedRegisterReasonInput, UpdateRelatedRegisterReasonMutation } from '#gql'

export class RegisterReasonService {
  async edit(id: string): Promise<EditRegisterReasonQuery | null> {
    try {
      const data = await GqlEditRegisterReason({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedRegisterReasonInput,
  ): Promise<CreateRelatedRegisterReasonMutation | null> {
    try {
      const data = await GqlCreateRelatedRegisterReason({ input: input })
      showGqlMutationError(data.createRelatedRegisterReason.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedRegisterReasonInput,
  ): Promise<UpdateRelatedRegisterReasonMutation | null> {
    try {
      const data = await GqlUpdateRelatedRegisterReason({ id: id, input: input })
      showGqlMutationError(data.updateRelatedRegisterReason.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const registerReasonService = new RegisterReasonService()
