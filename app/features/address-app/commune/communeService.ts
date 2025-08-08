import type { CreateRelatedCommuneInput, CreateRelatedCommuneMutation, EditCommuneQuery, UpdateRelatedCommuneInput, UpdateRelatedCommuneMutation } from '#gql'

export class CommuneService {
  async edit(id: string): Promise<EditCommuneQuery | null> {
    try {
      const data = await GqlEditCommune({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedCommuneInput,
  ): Promise<CreateRelatedCommuneMutation | null> {
    try {
      const data = await GqlCreateRelatedCommune({ input: input })
      showGqlMutationError(data.createRelatedCommune.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedCommuneInput,
  ): Promise<UpdateRelatedCommuneMutation | null> {
    try {
      const data = await GqlUpdateRelatedCommune({ id: id, input: input })
      showGqlMutationError(data.updateRelatedCommune.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const communeService = new CommuneService()
