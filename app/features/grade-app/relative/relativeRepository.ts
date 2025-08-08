import type {
  CreateRelatedRelativeInput,
  CreateRelatedRelativeMutation,
  EditRelativeQuery,
  UpdateRelatedRelativeInput,
  UpdateRelatedRelativeMutation,
} from '#gql'
import type { RelativeService } from '#imports'

class RelativeRepository {
  private service: RelativeService

  constructor(service: RelativeService) {
    this.service = service
  }

  async edit(id: string): Promise<EditRelativeQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedRelativeInput,
  ): Promise<CreateRelatedRelativeMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedRelativeInput,
  ): Promise<UpdateRelatedRelativeMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const relativeRepository = new RelativeRepository(relativeService)
