import type { PermissionService } from './permissionService'
import type { GeneratePermissionsMutation } from '#gql'

class PermissionRepository {
  private service: PermissionService

  constructor(service: PermissionService) {
    this.service = service
  }

  async generatePermissions(): Promise<GeneratePermissionsMutation | null> {
    return await this.service.generatePermissions()
  }
}
export const permissionRepository = new PermissionRepository(permissionService)
