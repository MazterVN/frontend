interface GraphQLErrorLocation {
  line: number
  column: number
}

interface GraphQLError {
  code: string
  message: string
  path: string[]
  fields: string[]
  vars: Record<string, unknown>
  locations: GraphQLErrorLocation[]
  short_message: string
}

export interface GraphQLResponse {
  client: string
  operationType: string
  operationName: string
  statusCode: number
  gqlErrors: GraphQLError[]
}
