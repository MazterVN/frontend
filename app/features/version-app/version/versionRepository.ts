import type { VersionService } from './versionService'
import type {
  CreateUpsertVersionInput,
  CreateUpsertVersionMutation,
  EditVersionQuery,
} from '#gql'

class VersionRepository {
  private service: VersionService

  constructor(service: VersionService) {
    this.service = service
  }

  async edit(id: string): Promise<EditVersionQuery> {
    return await this.service.edit(id)
  }

  async createUpsert(
    input: CreateUpsertVersionInput,
  ): Promise<CreateUpsertVersionMutation | null> {
    return await this.service.createUpsert(input)
  }
}

export const versionRepository = new VersionRepository(versionService)
