import type { CreateRelatedMonthsOfYearInput, CreateRelatedMonthsOfYearMutation, EditMonthsOfYearQuery, UpdateRelatedMonthsOfYearInput, UpdateRelatedMonthsOfYearMutation } from '#gql'
import type { MonthsOfYearService } from '#imports'

class MonthsOfYearRepository {
  private service: MonthsOfYearService

  constructor(service: MonthsOfYearService) {
    this.service = service
  }

  async edit(id: string): Promise<EditMonthsOfYearQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedMonthsOfYearInput,
  ): Promise<CreateRelatedMonthsOfYearMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedMonthsOfYearInput,
  ): Promise<UpdateRelatedMonthsOfYearMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const monthsOfYearRepository = new MonthsOfYearRepository(
  monthsOfYearService,
)
