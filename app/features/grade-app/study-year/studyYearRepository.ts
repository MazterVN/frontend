import type { StudyYearService } from './studyYearService'
import type {
  CreateRelatedStudyYearInput,
  CreateRelatedStudyYearMutation,
  EditStudyYearQuery,
  UpdateRelatedStudyYearInput,
  UpdateRelatedStudyYearMutation,
} from '#gql'

class StudyYearRepository {
  private service: StudyYearService

  constructor(service: StudyYearService) {
    this.service = service
  }

  async edit(id: string): Promise<EditStudyYearQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedStudyYearInput,
  ): Promise<CreateRelatedStudyYearMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedStudyYearInput,
  ): Promise<UpdateRelatedStudyYearMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const studyYearRepository = new StudyYearRepository(studyYearService)
