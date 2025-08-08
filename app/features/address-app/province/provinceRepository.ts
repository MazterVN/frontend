import type {
  CreateRelatedProvinceInput,
  CreateRelatedProvinceMutation,
  EditProvinceQuery,
  UpdateRelatedProvinceInput,
  UpdateRelatedProvinceMutation,
} from '#gql'
import type { ProvinceService } from '#imports'

class ProvinceRepository {
  private service: ProvinceService

  constructor(service: ProvinceService) {
    this.service = service
  }

  async edit(id: string): Promise<EditProvinceQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedProvinceInput,
  ): Promise<CreateRelatedProvinceMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedProvinceInput,
  ): Promise<UpdateRelatedProvinceMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const provinceRepository = new ProvinceRepository(provinceService)
