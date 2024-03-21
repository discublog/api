import {
  auth,
  queryByCategoryName,
  queryByCategoryId,
  queryByNumber,
  queryCategories,
  queryLabels,
  search,
  type AuthParams,
  type Configuration,
  type SearchParams,
  type QueryByCategoryNameParams,
  type QueryByCategoryIdParams,
  type QueryByNumberParams,
} from './queries'

export class Client {
  private config: Configuration = {
    client: null,
    owner: null,
    name: null,
  }
  constructor(params: AuthParams) {
    auth(this.config, params)
  }

  search(params: SearchParams = {}) {
    return search(this.config, params)
  }

  queryByCategoryName(params: QueryByCategoryNameParams) {
    return queryByCategoryName(this.config, params)
  }

  queryByCategoryId(params: QueryByCategoryIdParams) {
    return queryByCategoryId(this.config, params)
  }

  queryByNumber(params: QueryByNumberParams) {
    return queryByNumber(this.config, params)
  }

  queryCategories() {
    return queryCategories(this.config)
  }

  queryLabels() {
    return queryLabels(this.config)
  }
}
