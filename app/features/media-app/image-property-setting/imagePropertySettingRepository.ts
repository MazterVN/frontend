import type { ImagePropertySettingService } from './imagePropertySettingService'
import type {
  CreateUpsertImagePropertySettingInput,
  CreateUpsertImagePropertySettingMutation,
  EditImagePropertySettingQuery,
} from '#gql'

class ImagePropertySettingRepository {
  private service: ImagePropertySettingService

  constructor(service: ImagePropertySettingService) {
    this.service = service
  }

  async edit(id: string): Promise<EditImagePropertySettingQuery> {
    return await this.service.edit(id)
  }

  async createRelatedUpsert(
    input: CreateUpsertImagePropertySettingInput,
  ): Promise<CreateUpsertImagePropertySettingMutation | null> {
    return await this.service.createUpsert(input)
  }
}
export const imagePropertySettingRepository
    = new ImagePropertySettingRepository(imagePropertySettingService)
