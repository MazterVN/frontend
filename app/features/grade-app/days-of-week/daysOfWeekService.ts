import type { CreateRelatedDaysOfWeekInput, CreateRelatedDaysOfWeekMutation, EditDaysOfWeekQuery, UpdateRelatedDaysOfWeekInput, UpdateRelatedDaysOfWeekMutation } from '#gql'

export class DaysOfWeekService {
  async edit(id: string): Promise<EditDaysOfWeekQuery | null> {
    try {
      const data = await GqlEditDaysOfWeek({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedDaysOfWeekInput,
  ): Promise<CreateRelatedDaysOfWeekMutation | null> {
    try {
      const data = await GqlCreateRelatedDaysOfWeek({ input: input })
      showGqlMutationError(data.createRelatedDaysOfWeek.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedDaysOfWeekInput,
  ): Promise<UpdateRelatedDaysOfWeekMutation | null> {
    try {
      const data = await GqlUpdateRelatedDaysOfWeek({ id: id, input: input })
      showGqlMutationError(data.updateRelatedDaysOfWeek.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const daysOfWeekService = new DaysOfWeekService()
