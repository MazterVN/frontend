import type { RoleService } from './roleService'
import type {
  CreateRelatedUpsertRoleInput,
  CreateRelatedUpsertRoleMutation,
  EditRoleQuery,
} from '#gql'

class RoleRepository {
  private service: RoleService

  constructor(service: RoleService) {
    this.service = service
  }

  async edit(id: string): Promise<EditRoleQuery> {
    return await this.service.edit(id)
  }

  async bulkCreateUpsert(
    input: CreateRelatedUpsertRoleInput,
  ): Promise<CreateRelatedUpsertRoleMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const roleRepository = new RoleRepository(roleService)
