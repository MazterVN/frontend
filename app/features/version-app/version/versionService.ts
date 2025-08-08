import type {
  CreateUpsertVersionInput,
  CreateUpsertVersionMutation,
  EditVersionQuery,
} from '#gql'

export class VersionService {
  async edit(id: string): Promise<EditVersionQuery> {
    return await GqlEditVersion({ id: id })
  }

  async createUpsert(
    input: CreateUpsertVersionInput,
  ): Promise<CreateUpsertVersionMutation | null> {
    try {
      const data = await GqlCreateUpsertVersion({ input: input })
      showGqlMutationError(data.createUpsertVersion.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const versionService = new VersionService()
