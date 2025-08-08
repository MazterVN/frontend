import type { InvoiceIntervalService } from './invoiceIntervalService'
import type {
  CreateUpsertInvoiceIntervalInput,
  CreateUpsertInvoiceIntervalMutation,
  EditInvoiceIntervalQuery,
} from '#gql'

class InvoiceIntervalRepository {
  private service: InvoiceIntervalService

  constructor(service: InvoiceIntervalService) {
    this.service = service
  }

  async edit(id: string): Promise<EditInvoiceIntervalQuery> {
    return await this.service.edit(id)
  }

  async createUpsert(
    input: CreateUpsertInvoiceIntervalInput,
  ): Promise<CreateUpsertInvoiceIntervalMutation | null> {
    return await this.service.createUpsert(input)
  }
}
export const invoiceIntervalRepository = new InvoiceIntervalRepository(
  invoiceIntervalService,
)
