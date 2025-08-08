import type { ParentService } from './parentService'
import type {
  CreateUpsertParentInput,
  CreateUpsertParentMutation,
  EditParentQuery,
} from '#gql'

class ParentRepository {
  private service: ParentService

  constructor(service: ParentService) {
    this.service = service
  }

  async edit(id: string): Promise<EditParentQuery> {
    return await this.service.edit(id)
  }

  async bulkCreateUpsert(
    input: CreateUpsertParentInput,
  ): Promise<CreateUpsertParentMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const parentRepository = new ParentRepository(parentService)
