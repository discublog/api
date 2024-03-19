interface PageInfo {
  endCursor?: string
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
}

interface PaginationConnection<T> {
  nodes: T[]
  pageInfo: PageInfo
  totalCount: number
}

interface Connection<T> {
  nodes: T[]
}

interface Label {
  id: string
  color: string
  name: string
}

interface Discussion {
  number: number
  title: string
  createdAt: string
  updatedAt: string
  url: string
  body?: string
  bodyHTML?: string
  labels: Connection<Label>
}

interface DiscussionCategory {
  id: string
  name: string
}

export type DiscussionsQuery = Repository<{ discussions: PaginationConnection<Discussion> }>
export type DiscussionCategoriesQuery = Repository<{
  discussionCategories: Connection<DiscussionCategory>
}>
export type AllLabelsQuery = Repository<{ labels: Connection<Label> }>
export type DiscussionsSearchQuery = Repository<{ search: PaginationConnection<Discussion> }>

export interface DiscussionsQueryVariables {
  first?: number
  owner: string
  name: string
  categoryId: string
  body?: boolean
  bodyHTML?: boolean
  cursor?: string
}

export interface DiscussionsSearchQueryVariables {
  query?: string
  first?: number
  body?: string
  bodyHTML?: string
  cursor?: string
}

type Repository<T> = { repository: T | null }
