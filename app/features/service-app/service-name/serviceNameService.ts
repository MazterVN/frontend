import type { CreateRelatedServiceNameInput, CreateRelatedServiceNameMutation, EditServiceNameQuery, UpdateRelatedServiceNameInput, UpdateRelatedServiceNameMutation } from '#gql'

export class ServiceNameService {
  async edit(id: string): Promise<EditServiceNameQuery | null> {
    try {
      const data = await GqlEditServiceName({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedServiceNameInput,
  ): Promise<CreateRelatedServiceNameMutation | null> {
    try {
      const data = await GqlCreateRelatedServiceName({ input: input })
      showGqlMutationError(data.createRelatedServiceName.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedServiceNameInput,
  ): Promise<UpdateRelatedServiceNameMutation | null> {
    try {
      const data = await GqlUpdateRelatedServiceName({ id: id, input: input })
      showGqlMutationError(data.updateRelatedServiceName.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const serviceNameService = new ServiceNameService()
