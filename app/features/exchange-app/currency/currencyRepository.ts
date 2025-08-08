import type { CurrencyService } from './currencyService'
import type {
  CreateUpsertCurrencyInput,
  CreateUpsertCurrencyMutation,
  EditCurrencyQuery,
} from '#gql'

class CurrencyRepository {
  private service: CurrencyService

  constructor(service: CurrencyService) {
    this.service = service
  }

  async edit(id: string): Promise<EditCurrencyQuery> {
    return await this.service.edit(id)
  }

  async createUpsert(
    input: CreateUpsertCurrencyInput,
  ): Promise<CreateUpsertCurrencyMutation | null> {
    return await this.service.createUpsert(input)
  }
}

export const currencyRepository = new CurrencyRepository(currencyService)
