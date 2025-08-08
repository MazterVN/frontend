import type {
  CreateRelatedUpsertMenuInput,
  CreateRelatedUpsertMenuMutation,
  ListRootMenuQuery,
} from '#gql'

export class MenuService {
  async listRoot(): Promise<ListRootMenuQuery> {
    return await GqlListRootMenu()
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertMenuInput,
  ): Promise<CreateRelatedUpsertMenuMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertMenu({
        input: input,
      })
      showGqlMutationError(data.createRelatedUpsertMenu.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const menuService = new MenuService()
