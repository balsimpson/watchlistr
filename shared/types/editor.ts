export type YouTubeEmbedData = {
  url: string
  videoId: string
  title: string
  authorName?: string
  authorUrl?: string
  thumbnailUrl?: string
}

export type CatalogEmbedData = {
  uid: string
  kind: 'movie' | 'tv' | 'book'
  source: 'tmdb' | 'google-books'
  sourceId: string
  title: string
  creators: string[]
  year?: string
  imageUrl?: string
  description?: string
  externalUrl?: string
}

export type EditorNodeUpdate = (_attrs: { payload: string }) => void

export type CatalogEditorController = {
  openCatalog: (_item: CatalogEmbedData, _update: EditorNodeUpdate) => void
}

export type PersistedEditorDraft = {
  title?: string
  excerpt?: string
  content?: string
  slug?: string
  collectionId?: string
  status?: 'draft' | 'published'
  savedAt?: number
}

export function encodeEditorPayload(value: unknown) {
  return encodeURIComponent(JSON.stringify(value)).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)
}

export function decodeEditorPayload<T>(payload: string | undefined, fallback: T): T {
  if (!payload) return fallback

  try {
    return JSON.parse(decodeURIComponent(payload)) as T
  } catch {
    return fallback
  }
}
