import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GQL_HOST,
  documents: 'app/graphql/**/*.graphql',
  generates: {
    './schema.graphql': {
      plugins: ['schema-ast'],
    },
    './app/graphql/generated/default.ts': {
      plugins: ['typescript-document-nodes'],
      config: {
        nameSuffix: 'Document',
        avoidOptionals: true,
        silent: true,
        skipTypename: true,
        useTypeImports: true,
        dedupeFragments: true,
        onlyOperationTypes: true,
      },
    },
  },
}
export default config
