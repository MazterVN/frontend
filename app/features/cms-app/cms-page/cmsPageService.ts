import type {
  CreateUpsertCmsPageInput,
  CreateUpsertCmsPageMutation,
  EditCmsPageQuery,
} from '#gql'

export class CmsPageService {
  async edit(id: string): Promise<EditCmsPageQuery> {
    return await GqlEditCmsPage({ id: id })
  }

  async createRelatedUpsert(
    input: CreateUpsertCmsPageInput,
  ): Promise<CreateUpsertCmsPageMutation | null> {
    try {
      const data = await GqlCreateUpsertCmsPage({ input: input })
      showGqlMutationError(data.createUpsertCmsPage.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const cmsPageService = new CmsPageService()
