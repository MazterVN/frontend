import type { CurrentEnrollmentStudyYearService } from '#imports'
import type { CreateUpsertCurrentEnrollmentStudyYearInput, CreateUpsertCurrentEnrollmentStudyYearMutation, ReadOneCurrentEnrollmentStudyYearQuery } from '#gql'

class CurrentEnrollmentStudyYearRepository {
  private service: CurrentEnrollmentStudyYearService

  constructor(service: CurrentEnrollmentStudyYearService) {
    this.service = service
  }

  async readOne(): Promise<ReadOneCurrentEnrollmentStudyYearQuery | null> {
    return await this.service.readOne()
  }

  async createUpsert(input: CreateUpsertCurrentEnrollmentStudyYearInput): Promise<CreateUpsertCurrentEnrollmentStudyYearMutation | null> {
    return await this.service.createUpsert(input)
  }
}

export const currentEnrollmentStudyYearRepository = new CurrentEnrollmentStudyYearRepository(currentEnrollmentStudyYearService)
