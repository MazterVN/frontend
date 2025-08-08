import type {
  CreateRelatedBestPracticeInput,
  CreateRelatedBestPracticeMutation,
  EditBestPracticeQuery,
  UpdateRelatedBestPracticeInput,
  UpdateRelatedBestPracticeMutation,
} from '#gql'
import { GqlCreateRelatedBestPractice, GqlEditBestPractice, GqlUpdateRelatedBestPractice } from '#gql'

export class BestPracticeService {
  async edit(id: string): Promise<EditBestPracticeQuery | null> {
    try {
      const data = await GqlEditBestPractice({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedBestPracticeInput,
  ): Promise<CreateRelatedBestPracticeMutation | null> {
    try {
      const data = await GqlCreateRelatedBestPractice({ input: input })
      showGqlMutationError(data.createRelatedBestPractice.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedBestPracticeInput,
  ): Promise<UpdateRelatedBestPracticeMutation | null> {
    try {
      const data = await GqlUpdateRelatedBestPractice({ id: id, input: input })
      showGqlMutationError(data.updateRelatedBestPractice.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const bestPracticeService = new BestPracticeService()
