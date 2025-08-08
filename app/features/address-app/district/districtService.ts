import type { CreateRelatedDistrictInput, CreateRelatedDistrictMutation, EditDistrictQuery, UpdateRelatedDistrictInput, UpdateRelatedDistrictMutation } from '#gql'

export class DistrictService {
  async edit(id: string): Promise<EditDistrictQuery | null> {
    try {
      const data = await GqlEditDistrict({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedDistrictInput,
  ): Promise<CreateRelatedDistrictMutation | null> {
    try {
      const data = await GqlCreateRelatedDistrict({ input: input })
      showGqlMutationError(data.createRelatedDistrict.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedDistrictInput,
  ): Promise<UpdateRelatedDistrictMutation | null> {
    try {
      const data = await GqlUpdateRelatedDistrict({ id: id, input: input })
      showGqlMutationError(data.updateRelatedDistrict.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const districtService = new DistrictService()
