import type {
  CreateRelatedEnrollmentInput,
  CreateRelatedEnrollmentMutation,
  EditEnrollmentQuery,
  UpdateRelatedEnrollmentInput,
  UpdateRelatedEnrollmentMutation,
} from '#gql'
import { GqlCreateRelatedEnrollment, GqlEditEnrollment, GqlUpdateRelatedEnrollment } from '#gql'

export class EnrollmentService {
  async edit(id: string): Promise<EditEnrollmentQuery | null> {
    try {
      const data = await GqlEditEnrollment({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedEnrollmentInput,
  ): Promise<CreateRelatedEnrollmentMutation | null> {
    try {
      const data = await GqlCreateRelatedEnrollment({ input: input })
      showGqlMutationError(data.createRelatedEnrollment.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedEnrollmentInput,
  ): Promise<UpdateRelatedEnrollmentMutation | null> {
    try {
      const data = await GqlUpdateRelatedEnrollment({ id: id, input: input })
      showGqlMutationError(data.updateRelatedEnrollment.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const enrollmentService = new EnrollmentService()
