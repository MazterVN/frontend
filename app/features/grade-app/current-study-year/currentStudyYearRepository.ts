import type { CurrentStudyYearService } from './currentStudyYearService'
import type {
  CreateUpsertCurrentStudyYearInput,
  CreateUpsertCurrentStudyYearMutation,
  EditCurrentStudyYearQuery,
} from '#gql'

class CurrentStudyYearRepository {
  private service: CurrentStudyYearService

  constructor(service: CurrentStudyYearService) {
    this.service = service
  }

  async edit(): Promise<EditCurrentStudyYearQuery> {
    return await this.service.edit()
  }

  async createUpsert(
    input: CreateUpsertCurrentStudyYearInput,
  ): Promise<CreateUpsertCurrentStudyYearMutation | null> {
    return await this.service.createUpsert(input)
  }
}
export const currentStudyYearRepository = new CurrentStudyYearRepository(
  currentStudyYearService,
)
