import { Octokit } from '@octokit/core'

import type {
  DiscussionsQuery,
  DiscussionsQueryVariables,
  DiscussionCategoriesQuery,
  AllLabelsQuery,
  DiscussionsSearchQuery,
  DiscussionsSearchQueryVariables,
} from './interface'

// type utils
type RepositoryOmit<T, K extends keyof T = never> = Omit<T, 'owner' | 'name' | K>
type PickPartial<T, K extends keyof T> = {
  [P in keyof T]: P extends K ? T[P] | undefined : T[P]
}

// auth configuration
export interface Configuration {
  client: Octokit | null
  owner: string | null
  name: string | null
}

export type RequiredConfiguration = {
  [K in keyof Configuration]: NonNullable<Configuration[K]>
}

function check(config: Configuration) {
  if (!config.client || !config.owner || !config.name) {
    throw new Error(`Please call auth() first to configure the client`)
  }
  return config as RequiredConfiguration
}

export type AuthParams = {
  token: string
  owner: string
  name: string
}

export function auth(config: Configuration, params: AuthParams) {
  config.client = new Octokit({ auth: params.token })
  config.owner = params.owner
  config.name = params.name
}

// Discussion Categories
export function queryCategories(config: Configuration): Promise<DiscussionCategoriesQuery> {
  const { client, owner, name } = check(config)
  return client.graphql(
    /* GraphQL */ `
      query DiscussionCategories($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          discussionCategories(first: 100) {
            nodes {
              id
              name
            }
          }
        }
      }
    `,
    {
      owner,
      name,
    },
  )
}

// Discussions
export type QueryByCategoryIdParams = RepositoryOmit<DiscussionsQueryVariables>

export function queryByCategoryId(
  config: Configuration,
  { first = 100, categoryId, body = false, bodyHTML = false, cursor }: QueryByCategoryIdParams,
): Promise<DiscussionsQuery> {
  const { client, owner, name } = check(config)
  return client.graphql(
    /* GraphQL */ `
      query Discussions(
        $first: Int!
        $owner: String!
        $name: String!
        $categoryId: ID!
        $body: Boolean!
        $bodyHTML: Boolean!
        $cursor: String
      ) {
        repository(owner: $owner, name: $name) {
          discussions(
            first: $first
            orderBy: { field: CREATED_AT, direction: DESC }
            after: $cursor
            categoryId: $categoryId
          ) {
            nodes {
              number
              title
              createdAt
              updatedAt
              url
              body @include(if: $body)
              bodyHTML @include(if: $bodyHTML)
              labels(first: 5) {
                nodes {
                  name
                  color
                }
              }
            }
            pageInfo {
              startCursor
              hasPreviousPage
              hasNextPage
              endCursor
            }
            totalCount
          }
        }
      }
    `,
    {
      first,
      owner,
      name,
      categoryId,
      body,
      bodyHTML,
      cursor,
    },
  )
}

export interface QueryByCategoryNameParams
  extends PickPartial<
    RepositoryOmit<DiscussionsQueryVariables, 'categoryId'>,
    'first' | 'body' | 'bodyHTML'
  > {
  name: string
}

export async function queryByCategoryName(
  config: Configuration,
  params: QueryByCategoryNameParams,
) {
  const { name, ...rest } = params
  const categoriesResponse = await queryCategories(config)
  const categories = categoriesResponse.repository?.discussionCategories.nodes
  const categoryId = categories?.find(category => category!.name === name)?.id
  if (!categoryId) {
    return null
  }
  return queryByCategoryId(config, { ...rest, categoryId })
}

export function queryLabels(config: Configuration): Promise<AllLabelsQuery> {
  const { client, owner, name } = check(config)
  return client.graphql(
    /* GraphQL */ `
      query AllLabels($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          labels(first: 100, orderBy: { field: NAME, direction: ASC }) {
            nodes {
              name
              color
            }
          }
        }
      }
    `,
    {
      owner,
      name,
    },
  )
}

interface SearchParamsByLabelAndCategory
  extends Omit<DiscussionsSearchQueryVariables, 'query'> {
  label?: string
  category?: string
}

type SearchParamsByQuery = DiscussionsSearchQueryVariables

export type SearchParams = SearchParamsByLabelAndCategory | SearchParamsByQuery

export function search(
  config: Configuration,
  params: SearchParams,
): Promise<DiscussionsSearchQuery> {
  const { client, owner, name } = check(config)
  const { first = 100, body = false, bodyHTML = false, cursor } = params
  let query = `repo:${owner}/${name}`
  if ('query' in params) {
    query += ` ${params.query}`
  } else {
    const { label, category } = params as SearchParamsByLabelAndCategory
    if (label) {
      query += ` label:${label}`
    }
    if (category) {
      query += ` category:${category}`
    }
  }
  return client.graphql(
    /* GraphQL */ `
      query DiscussionsSearch(
        $query: String!
        $first: Int!
        $body: Boolean!
        $bodyHTML: Boolean!
        $cursor: String
      ) {
        search(first: $first, type: DISCUSSION, query: $query, after: $cursor) {
          nodes {
            ... on Discussion {
              number
              title
              createdAt
              updatedAt
              url
              body @include(if: $body)
              bodyHTML @include(if: $bodyHTML)
              labels(first: 5) {
                nodes {
                  color
                  name
                }
              }
            }
          }
          pageInfo {
            startCursor
            hasPreviousPage
            hasNextPage
            endCursor
          }
          totalCount: discussionCount
        }
      }
    `,
    {
      first,
      cursor,
      body,
      bodyHTML,
      query,
    },
  )
}
