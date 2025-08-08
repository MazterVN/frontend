import type { CurrencyBaseService } from './currencyBaseService'
import type {
  CreateUpsertCurrencyBaseInput,
  CreateUpsertCurrencyBaseMutation,
  EditCurrencyBaseQuery,
} from '#gql'

class CurrencyBaseRepository {
  private service: CurrencyBaseService

  constructor(service: CurrencyBaseService) {
    this.service = service
  }

  async edit(id: string): Promise<EditCurrencyBaseQuery> {
    return await this.service.edit(id)
  }

  async createUpsert(
    input: CreateUpsertCurrencyBaseInput,
  ): Promise<CreateUpsertCurrencyBaseMutation | null> {
    return await this.service.createUpsert(input)
  }
}

export const currencyBaseRepository = new CurrencyBaseRepository(currencyBaseService)
