import type {
  CreateRelatedStudentNoteInput,
  CreateRelatedStudentNoteMutation,
  EditStudentNoteQuery,
  UpdateRelatedStudentNoteInput,
  UpdateRelatedStudentNoteMutation,
} from '#gql'
import { GqlCreateRelatedStudentNote, GqlEditStudentNote, GqlUpdateRelatedStudentNote } from '#gql'

export class StudentNoteService {
  async edit(id: string): Promise<EditStudentNoteQuery | null> {
    try {
      const data = await GqlEditStudentNote({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedStudentNoteInput,
  ): Promise<CreateRelatedStudentNoteMutation | null> {
    try {
      const data = await GqlCreateRelatedStudentNote({ input: input })
      showGqlMutationError(data.createRelatedStudentNote.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedStudentNoteInput,
  ): Promise<UpdateRelatedStudentNoteMutation | null> {
    try {
      const data = await GqlUpdateRelatedStudentNote({ id: id, input: input })
      showGqlMutationError(data.updateRelatedStudentNote.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studentNoteService = new StudentNoteService()
