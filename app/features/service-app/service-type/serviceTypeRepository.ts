import type {
  CreateRelatedServiceTypeInput,
  CreateRelatedServiceTypeMutation,
  EditServiceTypeQuery,
  UpdateRelatedServiceTypeInput,
  UpdateRelatedServiceTypeMutation,
} from '#gql'
import type { ServiceTypeService } from '#imports'

class ServiceTypeRepository {
  private service: ServiceTypeService

  constructor(service: ServiceTypeService) {
    this.service = service
  }

  async edit(id: string): Promise<EditServiceTypeQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedServiceTypeInput,
  ): Promise<CreateRelatedServiceTypeMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedServiceTypeInput,
  ): Promise<UpdateRelatedServiceTypeMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const serviceTypeRepository = new ServiceTypeRepository(serviceTypeService)
