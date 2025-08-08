import type {
  CreateUpsertCurrencyInput,
  CreateUpsertCurrencyMutation,
  EditCurrencyQuery } from '#gql'

export class CurrencyService {
  async edit(id: string): Promise<EditCurrencyQuery> {
    return await GqlEditCurrency({ id: id })
  }

  async createUpsert(
    input: CreateUpsertCurrencyInput,
  ): Promise<CreateUpsertCurrencyMutation | null> {
    try {
      const data = await GqlCreateUpsertCurrency({ input: input })
      showGqlMutationError(data.createUpsertCurrency.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const currencyService = new CurrencyService()
