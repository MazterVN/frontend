import type {
  CreateRelatedSubjectInput,
  CreateRelatedSubjectMutation,
  EditSubjectQuery,
  UpdateRelatedSubjectInput,
  UpdateRelatedSubjectMutation,
} from '#gql'
import type { SubjectService } from '#imports'

class SubjectRepository {
  private service: SubjectService

  constructor(service: SubjectService) {
    this.service = service
  }

  async edit(id: string): Promise<EditSubjectQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedSubjectInput,
  ): Promise<CreateRelatedSubjectMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedSubjectInput,
  ): Promise<UpdateRelatedSubjectMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const subjectRepository = new SubjectRepository(subjectService)
