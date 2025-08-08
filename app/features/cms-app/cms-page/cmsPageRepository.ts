import type { CmsPageService } from './cmsPageService'
import type {
  CreateUpsertCmsPageInput,
  CreateUpsertCmsPageMutation,
  EditCmsPageQuery,
} from '#gql'

class CmsPageRepository {
  private service: CmsPageService

  constructor(service: CmsPageService) {
    this.service = service
  }

  async edit(id: string): Promise<EditCmsPageQuery> {
    return await this.service.edit(id)
  }

  async bulkCreateUpsert(
    input: CreateUpsertCmsPageInput,
  ): Promise<CreateUpsertCmsPageMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const cmsPageRepository = new CmsPageRepository(cmsPageService)
