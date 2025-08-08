import type { BestPracticeService } from '#imports'
import type {
  CreateRelatedBestPracticeInput,
  CreateRelatedBestPracticeMutation,
  EditBestPracticeQuery,
  UpdateRelatedBestPracticeInput,
  UpdateRelatedBestPracticeMutation,
} from '#gql'

class BestPracticeRepository {
  private service: BestPracticeService

  constructor(service: BestPracticeService) {
    this.service = service
  }

  async edit(id: string): Promise<EditBestPracticeQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedBestPracticeInput,
  ): Promise<CreateRelatedBestPracticeMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedBestPracticeInput,
  ): Promise<UpdateRelatedBestPracticeMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const bestPracticeRepository = new BestPracticeRepository(bestPracticeService)
