import type {
  CreateUpsertInvoiceIntervalInput,
  CreateUpsertInvoiceIntervalMutation,
  EditInvoiceIntervalQuery,
} from '#gql'

export class InvoiceIntervalService {
  async edit(id: string): Promise<EditInvoiceIntervalQuery> {
    return await GqlEditInvoiceInterval({ id: id })
  }

  async createUpsert(
    input: CreateUpsertInvoiceIntervalInput,
  ): Promise<CreateUpsertInvoiceIntervalMutation | null> {
    try {
      const data = await GqlCreateUpsertInvoiceInterval({
        input: input,
      })
      showGqlMutationError(data.createUpsertInvoiceInterval.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const invoiceIntervalService = new InvoiceIntervalService()
