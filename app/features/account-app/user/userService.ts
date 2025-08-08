import type {
  CurrentUserDatetimeQuery,
  EditUserQuery,
  GetAuthenticatedQuery,
  SignInMutation,
  UpdateRelatedUserInput,
  UpdateRelatedUserMutation,
} from '#gql'

export class UserService {
  async edit(id: string): Promise<EditUserQuery> {
    return await GqlEditUser({ id: id })
  }

  async getAuthenticated(accessToken: string): Promise<GetAuthenticatedQuery | null> {
    try {
      const data = await GqlGetAuthenticated({ accessToken: accessToken })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedUserInput,
  ): Promise<UpdateRelatedUserMutation | null> {
    try {
      const data = await GqlUpdateRelatedUser({
        id: id,
        input: input,
      })
      showGqlMutationError(data.updateRelatedUser.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async signIn(
    accessToken: string,
  ): Promise<SignInMutation | null> {
    try {
      const data = await GqlSignIn({
        accessToken: accessToken,
      })
      showGqlMutationError(data.signIn.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async currentUserDatetime(): Promise<CurrentUserDatetimeQuery> {
    return await GqlCurrentUserDatetime()
  }
}

export const userService = new UserService()
