import {
  auth as authWithConfig,
  queryByCategoryName as queryByCategoryNameWithConfig,
  queryByCategoryId as queryByCategoryIdWithConfig,
  queryCategories as queryCategoriesWithConfig,
  queryLabels as queryLabelsWithConfig,
  search as searchWithConfig,
  type AuthParams,
  type Configuration,
  type SearchParams,
  type QueryByCategoryNameParams,
  type QueryByCategoryIdParams,
} from './queries'

const config: Configuration = {
  client: null,
  owner: null,
  name: null,
}

export function auth(params: AuthParams) {
  authWithConfig(config, params)
}

export function queryByCategoryName(params: QueryByCategoryNameParams) {
  return queryByCategoryNameWithConfig(config, params)
}

export function queryByCategoryId(params: QueryByCategoryIdParams) {
  return queryByCategoryIdWithConfig(config, params)
}

export function queryCategories() {
  return queryCategoriesWithConfig(config)
}

export function queryLabels() {
  return queryLabelsWithConfig(config)
}

export function search(params: SearchParams = {}) {
  return searchWithConfig(config, params)
}
