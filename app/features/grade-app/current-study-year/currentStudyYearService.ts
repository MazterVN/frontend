import type {
  CreateUpsertCurrentStudyYearInput,
  CreateUpsertCurrentStudyYearMutation,
  EditCurrentStudyYearQuery,
} from '#gql'

export class CurrentStudyYearService {
  async edit(): Promise<EditCurrentStudyYearQuery> {
    return await GqlEditCurrentStudyYear()
  }

  async createUpsert(
    input: CreateUpsertCurrentStudyYearInput,
  ): Promise<CreateUpsertCurrentStudyYearMutation | null> {
    try {
      const data = await GqlCreateUpsertCurrentStudyYear({
        input: input,
      })
      showGqlMutationError(data.createUpsertCurrentStudyYear.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const currentStudyYearService = new CurrentStudyYearService()
