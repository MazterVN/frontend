import type {
  CreateRelatedUpsertDiscountInput,
  CreateRelatedUpsertDiscountMutation,
  EditDiscountQuery,
} from '#gql'
import type { DiscountDiscount } from '#imports'

class DiscountRepository {
  private discount: DiscountDiscount

  constructor(discount: DiscountDiscount) {
    this.discount = discount
  }

  async edit(id: string): Promise<EditDiscountQuery> {
    return await this.discount.edit(id)
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertDiscountInput,
  ): Promise<CreateRelatedUpsertDiscountMutation | null> {
    return await this.discount.createRelatedUpsert(input)
  }
}
export const discountRepository = new DiscountRepository(discountDiscount)
