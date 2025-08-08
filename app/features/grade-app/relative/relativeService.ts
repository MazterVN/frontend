import type { CreateRelatedRelativeInput, CreateRelatedRelativeMutation, EditRelativeQuery, UpdateRelatedRelativeInput, UpdateRelatedRelativeMutation } from '#gql'

export class RelativeService {
  async edit(id: string): Promise<EditRelativeQuery | null> {
    try {
      const data = await GqlEditRelative({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedRelativeInput,
  ): Promise<CreateRelatedRelativeMutation | null> {
    try {
      const data = await GqlCreateRelatedRelative({ input: input })
      showGqlMutationError(data.createRelatedRelative.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedRelativeInput,
  ): Promise<UpdateRelatedRelativeMutation | null> {
    try {
      const data = await GqlUpdateRelatedRelative({ id: id, input: input })
      showGqlMutationError(data.updateRelatedRelative.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const relativeService = new RelativeService()
