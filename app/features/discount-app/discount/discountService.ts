import type {
  CreateRelatedUpsertDiscountInput,
  CreateRelatedUpsertDiscountMutation,
  EditDiscountQuery,
} from '#gql'

export class DiscountDiscount {
  async edit(id: string): Promise<EditDiscountQuery> {
    return await GqlEditDiscount({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertDiscountInput,
  ): Promise<CreateRelatedUpsertDiscountMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertDiscount({ input: input })
      showGqlMutationError(data.createRelatedUpsertDiscount.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const discountDiscount = new DiscountDiscount()
