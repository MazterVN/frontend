import { debounce } from '@syncfusion/ej2-base'
import type { Predicate, Query } from '@syncfusion/ej2-data'
import type { DocumentNode } from 'graphql'

export const predicateMemoize = useMemoize(
  (value: Predicate) => value,
  { getKey: (value: Predicate) => JSON.stringify(value.toJson()) },
)

export const objectMemoize = useMemoize(
  (value: object) => value,
  { getKey: (value: object) => JSON.stringify(value) },
)

export const toolbarMemoize = useMemoize(
  (value: ToolbarItemType[]) => value,
  { getKey: (value: ToolbarItemType[]) => JSON.stringify(value) },
)

export const graphqlMemoize = useMemoize(
  (document: DocumentNode, variables: object = {}) => {
    if (!Object.keys(variables).length) return gridDataSource(document)
    return gridDataSourceVars(document, variables)
  },
  { getKey: (document: DocumentNode, variables: object) => JSON.stringify({ document: document.loc?.source.body ?? '', variables }) },
)

export const queryMemoize = useMemoize(
  (value: Query) => value,
  { getKey: (value: Query) => JSON.stringify(value.queries) },
)

export const debounceCallback = debounce((callback: () => void) => {
  callback()
}, 1000)
