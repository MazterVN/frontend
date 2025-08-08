import type {
  BulkCreateUpsertTimetableInput,
  BulkCreateUpsertTimetableMutation,
  GetTimetableAsTableQuery,
} from '#gql'

export class TimetableService {
  async getAsTable(subjectGroupingId: string, serviceDetailId: string): Promise<GetTimetableAsTableQuery> {
    return await GqlGetTimetableAsTable({
      subjectGroupingId: subjectGroupingId,
      serviceDetailId: serviceDetailId,
    })
  }

  async bulkCreateUpsert(
    input: BulkCreateUpsertTimetableInput,
  ): Promise<BulkCreateUpsertTimetableMutation | null> {
    try {
      const data = await GqlBulkCreateUpsertTimetable({ input: input })
      showGqlMutationError(data.bulkCreateUpsertTimetable.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const timetableService = new TimetableService()
