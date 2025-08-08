import type { CreateRelatedMonthsOfYearInput, CreateRelatedMonthsOfYearMutation, EditMonthsOfYearQuery, UpdateRelatedMonthsOfYearInput, UpdateRelatedMonthsOfYearMutation } from '#gql'

export class MonthsOfYearService {
  async edit(id: string): Promise<EditMonthsOfYearQuery | null> {
    try {
      const data = await GqlEditMonthsOfYear({ id: id })
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async createRelated(
    input: CreateRelatedMonthsOfYearInput,
  ): Promise<CreateRelatedMonthsOfYearMutation | null> {
    try {
      const data = await GqlCreateRelatedMonthsOfYear({ input: input })
      showGqlMutationError(data.createRelatedMonthsOfYear.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedMonthsOfYearInput,
  ): Promise<UpdateRelatedMonthsOfYearMutation | null> {
    try {
      const data = await GqlUpdateRelatedMonthsOfYear({ id: id, input: input })
      showGqlMutationError(data.updateRelatedMonthsOfYear.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const monthsOfYearService = new MonthsOfYearService()
