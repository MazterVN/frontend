import type {
  CreateRelatedGpaConditionInput,
  CreateRelatedGpaConditionMutation,
  EditGpaConditionQuery,
  UpdateRelatedGpaConditionInput,
  UpdateRelatedGpaConditionMutation,
} from '#gql'
import type { GpaConditionService } from '#imports'

class GpaConditionRepository {
  private service: GpaConditionService

  constructor(service: GpaConditionService) {
    this.service = service
  }

  async edit(id: string): Promise<EditGpaConditionQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedGpaConditionInput,
  ): Promise<CreateRelatedGpaConditionMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedGpaConditionInput,
  ): Promise<UpdateRelatedGpaConditionMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const gpaConditionRepository = new GpaConditionRepository(gpaConditionService)
