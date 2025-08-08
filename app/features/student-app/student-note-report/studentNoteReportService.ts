import type {
  GetStudentNoteReportQuery,
  GetStudentNoteReportQueryVariables,
} from '#gql'
import { GqlGetStudentNoteReport } from '#gql'

export class StudentNoteReportService {
  async get(variables: GetStudentNoteReportQueryVariables): Promise<GetStudentNoteReportQuery | null> {
    try {
      const data = await GqlGetStudentNoteReport(variables)
      return data
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const studentNoteReportService = new StudentNoteReportService()
