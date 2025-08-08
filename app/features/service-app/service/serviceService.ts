import type {
  CreateRelatedUpsertServiceInput,
  CreateRelatedUpsertServiceMutation,
  EditServiceQuery,
} from '#gql'

export class ServiceService {
  async edit(id: string): Promise<EditServiceQuery> {
    return await GqlEditService({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertServiceInput,
  ): Promise<CreateRelatedUpsertServiceMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertService({ input: input })
      showGqlMutationError(data.createRelatedUpsertService.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const serviceService = new ServiceService()
