import type {
  CreateRelatedEnrollmentSettingInput,
  CreateRelatedEnrollmentSettingMutation,
  EditEnrollmentSettingQuery,
  UpdateRelatedEnrollmentSettingInput,
  UpdateRelatedEnrollmentSettingMutation,
} from '#gql'
import { GqlCreateRelatedEnrollmentSetting, GqlEditEnrollmentSetting, GqlUpdateRelatedEnrollmentSetting } from '#gql'

export class EnrollmentSettingService {
  async edit(id: string): Promise<EditEnrollmentSettingQuery | null> {
    try {
      const data = await GqlEditEnrollmentSetting({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedEnrollmentSettingInput,
  ): Promise<CreateRelatedEnrollmentSettingMutation | null> {
    try {
      const data = await GqlCreateRelatedEnrollmentSetting({ input: input })
      showGqlMutationError(data.createRelatedEnrollmentSetting.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedEnrollmentSettingInput,
  ): Promise<UpdateRelatedEnrollmentSettingMutation | null> {
    try {
      const data = await GqlUpdateRelatedEnrollmentSetting({ id: id, input: input })
      showGqlMutationError(data.updateRelatedEnrollmentSetting.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const enrollmentSettingService = new EnrollmentSettingService()
