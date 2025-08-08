import type { UserService } from './userService'
import type {
  EditUserQuery,
  UpdateRelatedUserMutation,
  UpdateRelatedUserInput,
  CurrentUserDatetimeQuery,
  SignInMutation,
  GetAuthenticatedQuery,
} from '#gql'

class UserRepository {
  private service: UserService

  constructor(service: UserService) {
    this.service = service
  }

  async edit(id: string): Promise<EditUserQuery> {
    return await this.service.edit(id)
  }

  async getAuthenticated(accessToken: string): Promise<GetAuthenticatedQuery | null> {
    return await this.service.getAuthenticated(accessToken)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedUserInput,
  ): Promise<UpdateRelatedUserMutation | null> {
    return await this.service.updateRelated(id, input)
  }

  async signIn(
    accessToken: string,
  ): Promise<SignInMutation | null> {
    return await this.service.signIn(accessToken)
  }

  async currentUserDatetime(): Promise<CurrentUserDatetimeQuery> {
    return await this.service.currentUserDatetime()
  }
}
export const userRepository = new UserRepository(
  userService,
)
