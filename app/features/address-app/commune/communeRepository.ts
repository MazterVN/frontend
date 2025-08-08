import type {
  CreateRelatedCommuneInput,
  CreateRelatedCommuneMutation,
  EditCommuneQuery,
  UpdateRelatedCommuneInput,
  UpdateRelatedCommuneMutation,
} from '#gql'
import type { CommuneService } from '#imports'

class CommuneRepository {
  private service: CommuneService

  constructor(service: CommuneService) {
    this.service = service
  }

  async edit(id: string): Promise<EditCommuneQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedCommuneInput,
  ): Promise<CreateRelatedCommuneMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedCommuneInput,
  ): Promise<UpdateRelatedCommuneMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const communeRepository = new CommuneRepository(communeService)
