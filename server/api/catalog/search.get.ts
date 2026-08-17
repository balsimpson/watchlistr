import type { CatalogItem, CatalogKind } from '~/types/catalog'

type SearchKind = CatalogKind | 'all'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const term = String(query.q ?? '').trim().slice(0, 120)
  const kind = String(query.kind ?? 'all') as SearchKind
  if (!term) return { items: [], errors: {} }

  const config = useRuntimeConfig()
  const searches: Promise<CatalogItem[]>[] = []
  const labels: string[] = []

  if (kind === 'all' || kind === 'movie') {
    searches.push(searchTmdb('movie', term, config.tmdbApiKey))
    labels.push('movie')
  }
  if (kind === 'all' || kind === 'tv') {
    searches.push(searchTmdb('tv', term, config.tmdbApiKey))
    labels.push('tv')
  }
  if (kind === 'all' || kind === 'book') {
    searches.push(searchBooks(term, config.googleBooksApiKey))
    labels.push('book')
  }

  const results = await Promise.allSettled(searches)
  const items: CatalogItem[] = []
  const errors: Record<string, string> = {}
  results.forEach((result, index) => {
    const label = labels[index]!
    if (result.status === 'fulfilled') items.push(...result.value)
    else errors[label] = result.reason instanceof Error ? result.reason.message : 'Search failed'
  })

  return { items, errors }
})

async function searchTmdb(kind: 'movie' | 'tv', term: string, apiKey: string): Promise<CatalogItem[]> {
  if (!apiKey) throw new Error('TMDB search is not configured')
  const url = new URL(`https://api.themoviedb.org/3/search/${kind}`)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('query', term)
  url.searchParams.set('include_adult', 'false')

  const body = await $fetch<{ results?: Array<Record<string, unknown>> }>(url.toString())
  const now = Date.now()
  return (body.results ?? []).slice(0, 12).map((result) => {
    const id = String(result.id)
    const title = String(result[kind === 'movie' ? 'title' : 'name'] ?? 'Untitled')
    const date = String(result[kind === 'movie' ? 'release_date' : 'first_air_date'] ?? '')
    const imagePath = typeof result.poster_path === 'string' ? result.poster_path : ''
    return {
      uid: `tmdb:${kind}:${id}`,
      kind,
      source: 'tmdb',
      sourceId: id,
      title,
      creators: [],
      year: date.slice(0, 4) || undefined,
      imageUrl: imagePath ? `https://image.tmdb.org/t/p/w500${imagePath}` : undefined,
      description: typeof result.overview === 'string' ? result.overview : undefined,
      categories: [],
      externalUrl: `https://www.themoviedb.org/${kind}/${id}`,
      sourceUrl: `https://www.themoviedb.org/${kind}/${id}`,
      details: { rating: result.vote_average ?? null, popularity: result.popularity ?? null },
      createdAt: now,
      updatedAt: now,
    } satisfies CatalogItem
  })
}

async function searchBooks(term: string, apiKey: string): Promise<CatalogItem[]> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes')
  url.searchParams.set('q', term)
  url.searchParams.set('maxResults', '12')
  url.searchParams.set('printType', 'books')
  if (apiKey) url.searchParams.set('key', apiKey)

  const body = await $fetch<{ items?: Array<{ id: string; volumeInfo?: Record<string, unknown> }> }>(url.toString())
  const now = Date.now()
  return (body.items ?? []).map((result) => {
    const info = result.volumeInfo ?? {}
    const imageLinks = (info.imageLinks ?? {}) as Record<string, unknown>
    const authors = Array.isArray(info.authors) ? info.authors.filter((author): author is string => typeof author === 'string') : []
    const publishedDate = typeof info.publishedDate === 'string' ? info.publishedDate : ''
    return {
      uid: `google-books:book:${result.id}`,
      kind: 'book',
      source: 'google-books',
      sourceId: result.id,
      title: typeof info.title === 'string' ? info.title : 'Untitled',
      creators: authors,
      year: publishedDate.slice(0, 4) || undefined,
      imageUrl: typeof imageLinks.thumbnail === 'string' ? imageLinks.thumbnail.replace('http://', 'https://') : undefined,
      description: typeof info.description === 'string' ? info.description : undefined,
      categories: Array.isArray(info.categories) ? info.categories.filter((category): category is string => typeof category === 'string') : [],
      externalUrl: typeof info.infoLink === 'string' ? info.infoLink : undefined,
      sourceUrl: `https://books.google.com/books?id=${encodeURIComponent(result.id)}`,
      details: { publisher: info.publisher ?? null, pageCount: info.pageCount ?? null },
      createdAt: now,
      updatedAt: now,
    } satisfies CatalogItem
  })
}
