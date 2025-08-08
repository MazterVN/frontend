import type {
  CreateRelatedDaysOfWeekInput,
  CreateRelatedDaysOfWeekMutation,
  EditDaysOfWeekQuery,
  UpdateRelatedDaysOfWeekInput,
  UpdateRelatedDaysOfWeekMutation,
} from '#gql'
import type { DaysOfWeekService } from '#imports'

class DaysOfWeekRepository {
  private service: DaysOfWeekService

  constructor(service: DaysOfWeekService) {
    this.service = service
  }

  async edit(id: string): Promise<EditDaysOfWeekQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedDaysOfWeekInput,
  ): Promise<CreateRelatedDaysOfWeekMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedDaysOfWeekInput,
  ): Promise<UpdateRelatedDaysOfWeekMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const daysOfWeekRepository = new DaysOfWeekRepository(daysOfWeekService)
