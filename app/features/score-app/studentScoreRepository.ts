import type { BatchUpdateGradeScoreInput, BatchUpdateGradeScoreMutation } from '#gql'
import type { StudentScoreService } from '#imports'

class StudentScoreRepository {
  private service: StudentScoreService

  constructor(service: StudentScoreService) {
    this.service = service
  }

  async batchUpdateGradeScore(
    id: string,
    input: BatchUpdateGradeScoreInput,
  ): Promise<BatchUpdateGradeScoreMutation | null> {
    return await this.service.batchUpdateGradeScore(id, input)
  }
}
export const studentScoreRepository = new StudentScoreRepository(studentScoreService)
