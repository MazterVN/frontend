import type {
  CreateRelatedUpsertStudentServiceLogInput,
  CreateRelatedUpsertStudentServiceLogMutation,
  EditStudentServiceLogQuery,
} from '#gql'

export class StudentServiceLogService {
  async edit(id: string): Promise<EditStudentServiceLogQuery> {
    return await GqlEditStudentServiceLog({ id: id })
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertStudentServiceLogInput,
  ): Promise<CreateRelatedUpsertStudentServiceLogMutation | null> {
    try {
      const data = await GqlCreateRelatedUpsertStudentServiceLog({ input: input })
      showGqlMutationError(data.createRelatedUpsertStudentServiceLog.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studentServiceLogService = new StudentServiceLogService()
