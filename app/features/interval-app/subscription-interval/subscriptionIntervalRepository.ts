import type { SubscriptionIntervalService } from './subscriptionIntervalService'
import type {
  CreateUpsertSubscriptionIntervalInput,
  CreateUpsertSubscriptionIntervalMutation,
  EditSubscriptionIntervalQuery,
} from '#gql'

class SubscriptionIntervalRepository {
  private service: SubscriptionIntervalService

  constructor(service: SubscriptionIntervalService) {
    this.service = service
  }

  async edit(id: string): Promise<EditSubscriptionIntervalQuery> {
    return await this.service.edit(id)
  }

  async createUpsert(
    input: CreateUpsertSubscriptionIntervalInput,
  ): Promise<CreateUpsertSubscriptionIntervalMutation | null> {
    return await this.service.createUpsert(input)
  }
}
export const subscriptionIntervalRepository = new SubscriptionIntervalRepository(
  subscriptionIntervalService,
)
