import type { CreateUpsertCurrentEnrollmentStudyYearInput, CreateUpsertCurrentEnrollmentStudyYearMutation, ReadOneCurrentEnrollmentStudyYearQuery } from '#gql'
import { GqlReadOneCurrentEnrollmentStudyYear } from '#gql'

export class CurrentEnrollmentStudyYearService {
  async readOne(): Promise<ReadOneCurrentEnrollmentStudyYearQuery | null> {
    try {
      const data = await GqlReadOneCurrentEnrollmentStudyYear()
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createUpsert(input: CreateUpsertCurrentEnrollmentStudyYearInput): Promise<CreateUpsertCurrentEnrollmentStudyYearMutation | null> {
    try {
      const data = await GqlCreateUpsertCurrentEnrollmentStudyYear({ input })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const currentEnrollmentStudyYearService = new CurrentEnrollmentStudyYearService()
