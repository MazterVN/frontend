import type { CreateRelatedProvinceInput, CreateRelatedProvinceMutation, EditProvinceQuery, UpdateRelatedProvinceInput, UpdateRelatedProvinceMutation } from '#gql'

export class ProvinceService {
  async edit(id: string): Promise<EditProvinceQuery | null> {
    try {
      const data = await GqlEditProvince({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedProvinceInput,
  ): Promise<CreateRelatedProvinceMutation | null> {
    try {
      const data = await GqlCreateRelatedProvince({ input: input })
      showGqlMutationError(data.createRelatedProvince.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedProvinceInput,
  ): Promise<UpdateRelatedProvinceMutation | null> {
    try {
      const data = await GqlUpdateRelatedProvince({ id: id, input: input })
      showGqlMutationError(data.updateRelatedProvince.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const provinceService = new ProvinceService()
