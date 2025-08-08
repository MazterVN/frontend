import type { BatchUpdateGradeScoreInput, BatchUpdateGradeScoreMutation } from '#gql'

export class StudentScoreService {
  async batchUpdateGradeScore(
    id: string,
    input: BatchUpdateGradeScoreInput,
  ): Promise<BatchUpdateGradeScoreMutation | null> {
    try {
      const data = await GqlBatchUpdateGradeScore({ id: id, input: input })
      showGqlMutationError(data.batchUpdateGradeScore.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studentScoreService = new StudentScoreService()
