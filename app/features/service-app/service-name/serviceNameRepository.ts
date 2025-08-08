import type {
  CreateRelatedServiceNameInput,
  CreateRelatedServiceNameMutation,
  EditServiceNameQuery,
  UpdateRelatedServiceNameInput,
  UpdateRelatedServiceNameMutation,
} from '#gql'
import type { ServiceNameService } from '#imports'

class ServiceNameRepository {
  private service: ServiceNameService

  constructor(service: ServiceNameService) {
    this.service = service
  }

  async edit(id: string): Promise<EditServiceNameQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedServiceNameInput,
  ): Promise<CreateRelatedServiceNameMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedServiceNameInput,
  ): Promise<UpdateRelatedServiceNameMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const serviceNameRepository = new ServiceNameRepository(serviceNameService)
