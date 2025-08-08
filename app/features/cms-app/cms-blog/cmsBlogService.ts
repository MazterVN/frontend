import type {
  CreateRelatedUpsertCmsBlogInput,
  CreateRelatedUpsertCmsBlogMutation,
  EditCmsBlogQuery,
} from '#gql'

export class CmsBlogService {
  async edit(id: string): Promise<EditCmsBlogQuery> {
    return await GqlEditCmsBlog({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertCmsBlogInput,
  ): Promise<CreateRelatedUpsertCmsBlogMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertCmsBlog({ input: input })
      showGqlMutationError(data.createRelatedUpsertCmsBlog.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const cmsBlogService = new CmsBlogService()
