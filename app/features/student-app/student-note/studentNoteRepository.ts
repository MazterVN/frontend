import type { StudentNoteService } from '#imports'
import type {
  CreateRelatedStudentNoteInput,
  CreateRelatedStudentNoteMutation,
  EditStudentNoteQuery,
  UpdateRelatedStudentNoteInput,
  UpdateRelatedStudentNoteMutation,
} from '#gql'

class StudentNoteRepository {
  private service: StudentNoteService

  constructor(service: StudentNoteService) {
    this.service = service
  }

  async edit(id: string): Promise<EditStudentNoteQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedStudentNoteInput,
  ): Promise<CreateRelatedStudentNoteMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedStudentNoteInput,
  ): Promise<UpdateRelatedStudentNoteMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const studentNoteRepository = new StudentNoteRepository(studentNoteService)
