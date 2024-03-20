export interface PageInfo {
  endCursor?: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
}

export interface PaginationConnection<T> {
  nodes: T[]
  pageInfo: PageInfo
  totalCount: number
}

export interface Connection<T> {
  nodes: T[]
}

export interface Label {
  id: string
  color: string
  name: string
}

export interface Author {
  avatarUrl: string
  url: string
  login: string
}

export interface Discussion {
  author: Author | null
  number: number
  title: string
  createdAt: string
  updatedAt: string
  url: string
  body?: string
  bodyHTML?: string
  bodyText?: string
  labels: Connection<Label>
}

export interface DiscussionCategory {
  id: string
  name: string
}

export type DiscussionsQuery = Repository<{ discussions: PaginationConnection<Discussion> }>
export type DiscussionCategoriesQuery = Repository<{
  discussionCategories: Connection<DiscussionCategory>
}>
export type AllLabelsQuery = Repository<{ labels: Connection<Label> }>
export type DiscussionsSearchQuery = { search: PaginationConnection<Discussion> }

export interface DiscussionsQueryVariables {
  first?: number
  owner: string
  name: string
  categoryId: string
  body?: boolean
  bodyHTML?: boolean
  bodyText?: boolean
  cursor?: string
}

export interface DiscussionsSearchQueryVariables {
  query?: string
  first?: number
  body?: boolean
  bodyHTML?: boolean
  bodyText?: boolean
  cursor?: string
}

export type Repository<T> = { repository: T | null }
