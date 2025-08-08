import type { EmployeeService } from './employeeService'
import type {
  CreateUpsertEmployeeInput,
  CreateUpsertEmployeeMutation,
  EditEmployeeQuery,
} from '#gql'

class EmployeeRepository {
  private service: EmployeeService

  constructor(service: EmployeeService) {
    this.service = service
  }

  async edit(id: string): Promise<EditEmployeeQuery> {
    return await this.service.edit(id)
  }

  async bulkCreateUpsert(
    input: CreateUpsertEmployeeInput,
  ): Promise<CreateUpsertEmployeeMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const employeeRepository = new EmployeeRepository(employeeService)
