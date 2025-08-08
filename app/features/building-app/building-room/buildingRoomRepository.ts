import type {
  CreateRelatedUpsertBuildingRoomInput,
  CreateRelatedUpsertBuildingRoomMutation,
  EditBuildingRoomQuery,
} from '#gql'
import type { BuildingRoomService } from '#imports'

class BuildingRoomRepository {
  private service: BuildingRoomService

  constructor(service: BuildingRoomService) {
    this.service = service
  }

  async edit(id: string): Promise<EditBuildingRoomQuery> {
    return await this.service.edit(id)
  }

  async createReateUpsert(
    input: CreateRelatedUpsertBuildingRoomInput,
  ): Promise<CreateRelatedUpsertBuildingRoomMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const buildingBuildingRoomRepository = new BuildingRoomRepository(buildingBuildingRoomService)
