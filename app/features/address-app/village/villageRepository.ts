import type {
  CreateRelatedVillageInput,
  CreateRelatedVillageMutation,
  EditVillageQuery,
  UpdateRelatedVillageInput,
  UpdateRelatedVillageMutation,
} from '#gql'
import type { VillageService } from '#imports'

class VillageRepository {
  private service: VillageService

  constructor(service: VillageService) {
    this.service = service
  }

  async edit(id: string): Promise<EditVillageQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedVillageInput,
  ): Promise<CreateRelatedVillageMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedVillageInput,
  ): Promise<UpdateRelatedVillageMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const villageRepository = new VillageRepository(villageService)
