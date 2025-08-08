import type { CreateRelatedVillageInput, CreateRelatedVillageMutation, EditVillageQuery, UpdateRelatedVillageInput, UpdateRelatedVillageMutation } from '#gql'

export class VillageService {
  async edit(id: string): Promise<EditVillageQuery | null> {
    try {
      const data = await GqlEditVillage({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedVillageInput,
  ): Promise<CreateRelatedVillageMutation | null> {
    try {
      const data = await GqlCreateRelatedVillage({ input: input })
      showGqlMutationError(data.createRelatedVillage.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedVillageInput,
  ): Promise<UpdateRelatedVillageMutation | null> {
    try {
      const data = await GqlUpdateRelatedVillage({ id: id, input: input })
      showGqlMutationError(data.updateRelatedVillage.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const villageService = new VillageService()
