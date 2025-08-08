import type { CreateRelatedSubjectInput, CreateRelatedSubjectMutation, EditSubjectQuery, UpdateRelatedSubjectInput, UpdateRelatedSubjectMutation } from '#gql'

export class SubjectService {
  async edit(id: string): Promise<EditSubjectQuery | null> {
    try {
      const data = await GqlEditSubject({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedSubjectInput,
  ): Promise<CreateRelatedSubjectMutation | null> {
    try {
      const data = await GqlCreateRelatedSubject({ input: input })
      showGqlMutationError(data.createRelatedSubject.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedSubjectInput,
  ): Promise<UpdateRelatedSubjectMutation | null> {
    try {
      const data = await GqlUpdateRelatedSubject({ id: id, input: input })
      showGqlMutationError(data.updateRelatedSubject.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const subjectService = new SubjectService()
