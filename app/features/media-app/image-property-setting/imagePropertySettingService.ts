import type {
  CreateUpsertImagePropertySettingInput,
  CreateUpsertImagePropertySettingMutation,
  EditImagePropertySettingQuery,
} from '#gql'

export class ImagePropertySettingService {
  async edit(id: string): Promise<EditImagePropertySettingQuery> {
    return await GqlEditImagePropertySetting({ id: id })
  }

  async createUpsert(
    input: CreateUpsertImagePropertySettingInput,
  ): Promise<CreateUpsertImagePropertySettingMutation | null> {
    try {
      const data = await GqlCreateUpsertImagePropertySetting({
        input: input,
      })
      showGqlMutationError(data.createUpsertImagePropertySetting.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const imagePropertySettingService = new ImagePropertySettingService()
