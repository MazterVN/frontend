import type { TimetableEmployeeService } from './timetableEmployeeService'
import type {
  CreateRelatedUpsertTimetableEmployeeInput,
  CreateRelatedUpsertTimetableEmployeeMutation,
  EditTimetableEmployeeQuery,
} from '#gql'

class TimetableEmployeeRepository {
  private service: TimetableEmployeeService

  constructor(service: TimetableEmployeeService) {
    this.service = service
  }

  async edit(id: string): Promise<EditTimetableEmployeeQuery> {
    return await this.service.edit(id)
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertTimetableEmployeeInput,
  ): Promise<CreateRelatedUpsertTimetableEmployeeMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const timetableEmployeeRepository = new TimetableEmployeeRepository(timetableEmployeeService)
