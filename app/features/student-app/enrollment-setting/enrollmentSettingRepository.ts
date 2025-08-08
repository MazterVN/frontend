import type {
  CreateRelatedEnrollmentSettingInput,
  CreateRelatedEnrollmentSettingMutation,
  EditEnrollmentSettingQuery,
  UpdateRelatedEnrollmentSettingInput,
  UpdateRelatedEnrollmentSettingMutation,
} from '#gql'
import type { EnrollmentSettingService } from '#imports'

class EnrollmentSettingRepository {
  private service: EnrollmentSettingService

  constructor(service: EnrollmentSettingService) {
    this.service = service
  }

  async edit(id: string): Promise<EditEnrollmentSettingQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedEnrollmentSettingInput,
  ): Promise<CreateRelatedEnrollmentSettingMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedEnrollmentSettingInput,
  ): Promise<UpdateRelatedEnrollmentSettingMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}

export const enrollmentSettingRepository = new EnrollmentSettingRepository(enrollmentSettingService)
