import type {
  CreateUpsertParentInput,
  CreateUpsertParentMutation,
  EditParentQuery,
} from '#gql'

export class ParentService {
  async edit(id: string): Promise<EditParentQuery> {
    return await GqlEditParent({ id: id })
  }

  async createRelatedUpsert(
    input: CreateUpsertParentInput,
  ): Promise<CreateUpsertParentMutation | null> {
    try {
      const data = await GqlCreateUpsertParent({ input: input })
      showGqlMutationError(data.createUpsertParent.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const parentService = new ParentService()
