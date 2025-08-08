import type {
  CreateRelatedGradeLevelInput,
  CreateRelatedGradeLevelMutation,
  EditGradeLevelQuery,
  UpdateRelatedGradeLevelInput,
  UpdateRelatedGradeLevelMutation,
} from '#gql'
import type { GradeLevelService } from '#imports'

class GradeLevelRepository {
  private service: GradeLevelService

  constructor(service: GradeLevelService) {
    this.service = service
  }

  async edit(id: string): Promise<EditGradeLevelQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedGradeLevelInput,
  ): Promise<CreateRelatedGradeLevelMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedGradeLevelInput,
  ): Promise<UpdateRelatedGradeLevelMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const gradeLevelRepository = new GradeLevelRepository(gradeLevelService)
