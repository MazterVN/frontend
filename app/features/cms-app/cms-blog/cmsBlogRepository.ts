import type { CmsBlogService } from './cmsBlogService'
import type {
  CreateRelatedUpsertCmsBlogInput,
  CreateRelatedUpsertCmsBlogMutation,
  EditCmsBlogQuery,
} from '#gql'

class CmsBlogRepository {
  private service: CmsBlogService

  constructor(service: CmsBlogService) {
    this.service = service
  }

  async edit(id: string): Promise<EditCmsBlogQuery> {
    return await this.service.edit(id)
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertCmsBlogInput,
  ): Promise<CreateRelatedUpsertCmsBlogMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const cmsBlogRepository = new CmsBlogRepository(cmsBlogService)
