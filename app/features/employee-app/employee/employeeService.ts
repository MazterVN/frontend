import type {
  CreateUpsertEmployeeInput,
  CreateUpsertEmployeeMutation,
  EditEmployeeQuery,
} from '#gql'

export class EmployeeService {
  async edit(id: string): Promise<EditEmployeeQuery> {
    return await GqlEditEmployee({ id: id })
  }

  async createRelatedUpsert(
    input: CreateUpsertEmployeeInput,
  ): Promise<CreateUpsertEmployeeMutation | null> {
    try {
      const data = await GqlCreateUpsertEmployee({ input: input })
      showGqlMutationError(data.createUpsertEmployee.errors)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const employeeService = new EmployeeService()
