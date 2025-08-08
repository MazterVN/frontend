import type { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql'
import {
  DataManager,
  GraphQLAdaptor,
  Query,
} from '@syncfusion/ej2-data'
import type {
  ContextMenuItem,
  ContextMenuItemModel,
  GridModel,
} from '@syncfusion/ej2-vue-grids'
import type { DropDownListModel, MultiSelectModel } from '@syncfusion/ej2-vue-dropdowns'
import type {
  DatamanagerOperator,
  DatamanagerSortDirection,
  DatamanagerCondition,
  InputMaybe,
} from '#gql/default'
import type {
  DatamanagerPredicateInput,
  DatamanagerSearchInput,
  DatamanagerSortedInput,
} from '#gql'

export const globalDropdownListConfig = (): DropDownListModel & MultiSelectModel => ({
  query: new Query().take(35).requiresCount(),
  filterType: 'Contains',
  allowFiltering: true,
  floatLabelType: 'Never',
  showClearButton: true,
  showDropDownIcon: true,
})

export const globalGridConfig: GridModel = {
  allowResizing: true,
  allowPaging: true,
  allowSorting: true,
  allowSelection: true,
  pageSettings: {
    pageCount: 5,
    pageSize: 35,
    pageSizes: ['35', '100', '200', '300', '500'],
  },
  selectionSettings: { type: 'Multiple' },
  loadingIndicator: { indicatorType: 'Shimmer' },
  gridLines: 'Both',
  enableHeaderFocus: true,
  height: 700,
  enablePersistence: false,
}
export function toContextMenuItems(
  items: (ContextMenuItem | ContextMenuItemModel)[],
): ContextMenuItem[] | ContextMenuItemModel[] {
  return items as ContextMenuItem[] | ContextMenuItemModel[]
}
export const toBody = (query: DocumentNode) => query.loc?.source.body || ''

export function gridDataSource(query: DocumentNode): DataManager {
  return graphqlSource(toBody(query), {
    result: `${queryToFieldName(query)}.results`,
    count: `${queryToFieldName(query)}.count`,
  })
}

export function gridDataSourceVars(
  query: DocumentNode,
  variables: object,
): DataManager {
  return graphqlSourceVars(
    toBody(query),
    {
      result: `${queryToFieldName(query)}.results`,
      count: `${queryToFieldName(query)}.count`,
    },
    variables,
  )
}
export function queryToFieldName(query: DocumentNode): string {
  return (
    (
      query.definitions.at(0) as OperationDefinitionNode
    ).selectionSet.selections.at(0) as FieldNode
  ).name.value
}
export function graphqlSource(
  query: string,
  response: {
    result: string
    count?: string
    aggregates?: string
  },
): DataManager {
  const session = useSupabaseSession()
  const runtimeConfig = useRuntimeConfig()
  const url = runtimeConfig.public.GQL_HOST
  const language = useCookie('_lang')
  const timezone = useCookie('_tz')
  return new DataManager({
    url,
    adaptor: new ExtendedGraphQLAdaptor({
      response,
      query,
      // getVariables: () => {
      //   return {
      //     language: language.value
      //       ? language.value.toUpperCase()
      //       : 'KM',
      //   }
      // },
    }),
    headers: [
      {
        'Authorization': `Bearer ${session.value?.access_token ?? ''}`,
        'X-Language': language.value,
        'X-Timezone': timezone.value,
      },
    ],
  })
}

export function graphqlSourceVars(
  query: string,
  response: {
    result: string
    count?: string
    aggregates?: string
  },
  variables: object,
): DataManager {
  const runtimeConfig = useRuntimeConfig()
  const url = runtimeConfig.public.GQL_HOST
  const language = useCookie('_lang')
  const timezone = useCookie('_tz')
  const session = useSupabaseSession()
  return new DataManager({
    url,
    adaptor: new ExtendedGraphQLAdaptor({
      response,
      query,
      getVariables: () => {
        return {
          ...variables,
        }
      },
    }),
    headers: [
      {
        'Authorization': `Bearer ${session.value?.access_token ?? ''}`,
        'X-Language': language.value,
        'X-Timezone': timezone.value,
      },
    ],
  })
}

export class ExtendedGraphQLAdaptor extends GraphQLAdaptor {
  public override processQuery(
    datamanager: DataManager,
    query: Query,
  ): object {
    const urlQuery = super.processQuery(datamanager, query) as { data: string }
    try {
      const data = JSON.parse(urlQuery.data)
      data.variables.datamanager.search = this.updateSearch(
        data.variables.datamanager.search,
      )
      data.variables.datamanager.sorted = this.updateSort(
        data.variables.datamanager.sorted,
      )
      data.variables.datamanager.where = this.updateWhere(
        data.variables.datamanager.where,
      )
      urlQuery.data = JSON.stringify(data)
    }
    catch (error) {
      console.error('Error processing query:', error)
      return urlQuery
    }
    return urlQuery
  }

  private updateWhere(data: string): DatamanagerPredicateInput[] {
    const items = this.parseOrDefault(
      data,
      [],
    ) as DatamanagerPredicateInput[]
    // bind(this) to keep the context of the function
    items.forEach(this.updatePredicate.bind(this))
    return items
  }

  private updateSearch(data: string): DatamanagerSearchInput[] {
    const items = this.parseOrDefault(data, []) as DatamanagerSearchInput[]

    return items.map(item => ({
      ...item,
      operator: (
        item.operator as string
      ).toUpperCase() as DatamanagerOperator,
    }))
  }

  private updateSort(data: string | Array<object> | null): DatamanagerSortedInput[] {
    const items = this.parseOrDefault(
      data,
      data ?? [],
    ) as DatamanagerSortedInput[]
    return items.map(item => ({
      ...item,
      direction: (
        item.direction as string
      ).toUpperCase() as DatamanagerSortDirection,
    }))
  }

  private updatePredicate(
    predicate: InputMaybe<DatamanagerPredicateInput>,
  ): void {
    if (predicate?.condition) {
      predicate.condition = (
        predicate.condition as string
      ).toUpperCase() as DatamanagerCondition
    }
    if (predicate?.operator) {
      predicate.operator = (
        predicate.operator as string
      ).toUpperCase() as DatamanagerOperator
    }
    if (predicate?.predicates) {
      // bind(this) to keep the context of the function
      predicate?.predicates.forEach(this.updatePredicate.bind(this))
    }
  }

  private parseOrDefault(jsonString: string | Array<object> | null, defaultValue: string | Array<object> | null): Array<object> {
    try {
      return JSON.parse(jsonString as string)
    }
    catch {
      return defaultValue as Array<object>
    }
  }
}
