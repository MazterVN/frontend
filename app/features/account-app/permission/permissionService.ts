import type { GeneratePermissionsMutation } from '#gql'

export class PermissionService {
  async generatePermissions(): Promise<GeneratePermissionsMutation | null> {
    try {
      const data = await GqlGeneratePermissions()
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const permissionService = new PermissionService()
