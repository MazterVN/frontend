import type {
  CreateRelatedUpsertRoleInput,
  CreateRelatedUpsertRoleMutation,
  EditRoleQuery,
} from '#gql'

export class RoleService {
  async edit(id: string): Promise<EditRoleQuery> {
    return await GqlEditRole({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertRoleInput,
  ): Promise<CreateRelatedUpsertRoleMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertRole({ input: input })
      showGqlMutationError(data.createRelatedUpsertRole.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const roleService = new RoleService()
