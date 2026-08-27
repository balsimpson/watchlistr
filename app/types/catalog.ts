export type CatalogKind = 'movie' | 'tv' | 'book'
export type CatalogSource = 'tmdb' | 'google-books'
export type LibraryState = 'saved' | 'completed'

export type CatalogItem = {
  _id?: string
  uid: string
  kind: CatalogKind
  source: CatalogSource
  sourceId: string
  title: string
  creators: string[]
  year?: string
  imageUrl?: string
  description?: string
  categories: string[]
  externalUrl?: string
  sourceUrl?: string
  details: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

export type LibraryEntry = {
  _id?: string
  uid: string
  sourceUrl?: string
  state: LibraryState
  addedAt: number
  completedAt?: number
  updatedAt: number
  deletedAt?: number
  revision?: number
  item: CatalogItem
}

export type DiscoverEntry = {
  id: string
  collectionSlug: string
  editorialNote?: string
  order: number
  item: Omit<CatalogItem, '_id' | 'externalUrl' | 'sourceUrl'> & { externalUrl?: string }
}

export type DiscoverArticle = {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  createdAt: number
  publishedAt?: number
}
