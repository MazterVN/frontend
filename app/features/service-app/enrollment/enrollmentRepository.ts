import type { EnrollmentService } from '#imports'
import type {
  CreateRelatedEnrollmentInput,
  CreateRelatedEnrollmentMutation,
  EditEnrollmentQuery,
  UpdateRelatedEnrollmentInput,
  UpdateRelatedEnrollmentMutation,
} from '#gql'

class EnrollmentRepository {
  private service: EnrollmentService

  constructor(service: EnrollmentService) {
    this.service = service
  }

  async edit(id: string): Promise<EditEnrollmentQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedEnrollmentInput,
  ): Promise<CreateRelatedEnrollmentMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedEnrollmentInput,
  ): Promise<UpdateRelatedEnrollmentMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const enrollmentRepository = new EnrollmentRepository(enrollmentService)
