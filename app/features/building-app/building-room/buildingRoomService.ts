import type {
  CreateRelatedUpsertBuildingRoomInput,
  CreateRelatedUpsertBuildingRoomMutation,
  EditBuildingRoomQuery,
} from '#gql'

export class BuildingRoomService {
  async edit(id: string): Promise<EditBuildingRoomQuery> {
    return await GqlEditBuildingRoom({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertBuildingRoomInput,
  ): Promise<CreateRelatedUpsertBuildingRoomMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertBuildingRoom({ input: input })
      showGqlMutationError(data.createRelatedUpsertBuildingRoom.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const buildingBuildingRoomService = new BuildingRoomService()
