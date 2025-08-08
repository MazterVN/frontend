import type { ServiceService } from './serviceService'
import type {
  CreateRelatedUpsertServiceInput,
  CreateRelatedUpsertServiceMutation,
  EditServiceQuery,
} from '#gql'

class ServiceRepository {
  private service: ServiceService

  constructor(service: ServiceService) {
    this.service = service
  }

  async edit(id: string): Promise<EditServiceQuery> {
    return await this.service.edit(id)
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertServiceInput,
  ): Promise<CreateRelatedUpsertServiceMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}
export const serviceRepository = new ServiceRepository(serviceService)
