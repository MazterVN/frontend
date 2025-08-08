import type { CreateRelatedServiceTypeInput, CreateRelatedServiceTypeMutation, EditServiceTypeQuery, UpdateRelatedServiceTypeInput, UpdateRelatedServiceTypeMutation } from '#gql'

export class ServiceTypeService {
  async edit(id: string): Promise<EditServiceTypeQuery | null> {
    try {
      const data = await GqlEditServiceType({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedServiceTypeInput,
  ): Promise<CreateRelatedServiceTypeMutation | null> {
    try {
      const data = await GqlCreateRelatedServiceType({ input: input })
      showGqlMutationError(data.createRelatedServiceType.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedServiceTypeInput,
  ): Promise<UpdateRelatedServiceTypeMutation | null> {
    try {
      const data = await GqlUpdateRelatedServiceType({ id: id, input: input })
      showGqlMutationError(data.updateRelatedServiceType.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const serviceTypeService = new ServiceTypeService()
