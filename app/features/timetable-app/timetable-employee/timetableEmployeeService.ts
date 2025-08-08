import type {
  CreateRelatedUpsertTimetableEmployeeInput,
  CreateRelatedUpsertTimetableEmployeeMutation,
  EditTimetableEmployeeQuery,
} from '#gql'

export class TimetableEmployeeService {
  async edit(id: string): Promise<EditTimetableEmployeeQuery> {
    return await GqlEditTimetableEmployee({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertTimetableEmployeeInput,
  ): Promise<CreateRelatedUpsertTimetableEmployeeMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertTimetableEmployee({ input: input })
      showGqlMutationError(data.createRelatedUpsertTimetableEmployee.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const timetableEmployeeService = new TimetableEmployeeService()
