import type {
  CreateRelatedDropReasonInput,
  CreateRelatedDropReasonMutation,
  EditDropReasonQuery,
  UpdateRelatedDropReasonInput,
  UpdateRelatedDropReasonMutation,
} from '#gql'
import type { DropReasonService } from '#imports'

class DropReasonRepository {
  private service: DropReasonService

  constructor(service: DropReasonService) {
    this.service = service
  }

  async edit(id: string): Promise<EditDropReasonQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedDropReasonInput,
  ): Promise<CreateRelatedDropReasonMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedDropReasonInput,
  ): Promise<UpdateRelatedDropReasonMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const dropReasonRepository = new DropReasonRepository(dropReasonService)
