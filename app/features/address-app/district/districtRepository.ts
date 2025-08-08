import type {
  CreateRelatedDistrictInput,
  CreateRelatedDistrictMutation,
  EditDistrictQuery,
  UpdateRelatedDistrictInput,
  UpdateRelatedDistrictMutation,
} from '#gql'
import type { DistrictService } from '#imports'

class DistrictRepository {
  private service: DistrictService

  constructor(service: DistrictService) {
    this.service = service
  }

  async edit(id: string): Promise<EditDistrictQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedDistrictInput,
  ): Promise<CreateRelatedDistrictMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedDistrictInput,
  ): Promise<UpdateRelatedDistrictMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const districtRepository = new DistrictRepository(districtService)
