import type {
  CreateRelatedRegisterReasonInput,
  CreateRelatedRegisterReasonMutation,
  EditRegisterReasonQuery,
  UpdateRelatedRegisterReasonInput,
  UpdateRelatedRegisterReasonMutation,
} from '#gql'
import type { RegisterReasonService } from '#imports'

class RegisterReasonRepository {
  private service: RegisterReasonService

  constructor(service: RegisterReasonService) {
    this.service = service
  }

  async edit(id: string): Promise<EditRegisterReasonQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedRegisterReasonInput,
  ): Promise<CreateRelatedRegisterReasonMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedRegisterReasonInput,
  ): Promise<UpdateRelatedRegisterReasonMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const registerReasonRepository = new RegisterReasonRepository(registerReasonService)
