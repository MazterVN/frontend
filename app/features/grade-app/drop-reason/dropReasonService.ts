import type { CreateRelatedDropReasonInput, CreateRelatedDropReasonMutation, EditDropReasonQuery, UpdateRelatedDropReasonInput, UpdateRelatedDropReasonMutation } from '#gql'

export class DropReasonService {
  async edit(id: string): Promise<EditDropReasonQuery | null> {
    try {
      const data = await GqlEditDropReason({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedDropReasonInput,
  ): Promise<CreateRelatedDropReasonMutation | null> {
    try {
      const data = await GqlCreateRelatedDropReason({ input: input })
      showGqlMutationError(data.createRelatedDropReason.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedDropReasonInput,
  ): Promise<UpdateRelatedDropReasonMutation | null> {
    try {
      const data = await GqlUpdateRelatedDropReason({ id: id, input: input })
      showGqlMutationError(data.updateRelatedDropReason.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const dropReasonService = new DropReasonService()
