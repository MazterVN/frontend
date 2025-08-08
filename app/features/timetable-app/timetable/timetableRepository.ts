import type { TimetableService } from './timetableService'
import type {
  BulkCreateUpsertTimetableInput,
  BulkCreateUpsertTimetableMutation,
  GetTimetableAsTableQuery,
} from '#gql'

class TimetableRepository {
  private service: TimetableService

  constructor(service: TimetableService) {
    this.service = service
  }

  async getAsTable(subjectGroupingId: string, serviceDetailId: string): Promise<GetTimetableAsTableQuery> {
    return await this.service.getAsTable(subjectGroupingId, serviceDetailId)
  }

  async bulkCreateUpsert(
    input: BulkCreateUpsertTimetableInput,
  ): Promise<BulkCreateUpsertTimetableMutation | null> {
    return await this.service.bulkCreateUpsert(input)
  }
}

export const timetableRepository = new TimetableRepository(timetableService)
