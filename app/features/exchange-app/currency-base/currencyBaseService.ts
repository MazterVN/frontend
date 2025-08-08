import type {
  CreateUpsertCurrencyBaseInput,
  CreateUpsertCurrencyBaseMutation,
  EditCurrencyBaseQuery } from '#gql'

export class CurrencyBaseService {
  async edit(id: string): Promise<EditCurrencyBaseQuery> {
    return await GqlEditCurrencyBase({ id: id })
  }

  async createUpsert(
    input: CreateUpsertCurrencyBaseInput,
  ): Promise<CreateUpsertCurrencyBaseMutation | null> {
    try {
      const data = await GqlCreateUpsertCurrencyBase({ input: input })
      showGqlMutationError(data.createUpsertCurrencyBase.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const currencyBaseService = new CurrencyBaseService()
