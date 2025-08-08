import type {
  CreateUpsertSubscriptionIntervalInput,
  CreateUpsertSubscriptionIntervalMutation,
  EditSubscriptionIntervalQuery,
} from '#gql'

export class SubscriptionIntervalService {
  async edit(id: string): Promise<EditSubscriptionIntervalQuery> {
    return await GqlEditSubscriptionInterval({ id: id })
  }

  async createUpsert(
    input: CreateUpsertSubscriptionIntervalInput,
  ): Promise<CreateUpsertSubscriptionIntervalMutation | null> {
    try {
      const data = await GqlCreateUpsertSubscriptionInterval({
        input: input,
      })
      showGqlMutationError(data.createUpsertSubscriptionInterval.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const subscriptionIntervalService = new SubscriptionIntervalService()
