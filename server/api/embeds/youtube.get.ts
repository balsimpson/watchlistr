import { parseYouTubeUrl } from '~~/shared/youtube'
import type { YouTubeEmbedData } from '~~/shared/types/editor'

type YouTubeOEmbedResponse = {
  title?: string
  author_name?: string
  author_url?: string
  thumbnail_url?: string
}

export default defineEventHandler(async (event): Promise<YouTubeEmbedData> => {
  const query = getQuery(event)
  const parsed = parseYouTubeUrl(String(query.url ?? ''))

  if (!parsed) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid YouTube video link.' })
  }

  try {
    const metadata = await $fetch<YouTubeOEmbedResponse>('https://www.youtube.com/oembed', {
      query: { url: parsed.url, format: 'json' },
    })

    return {
      ...parsed,
      title: metadata.title?.trim() || 'YouTube video',
      authorName: metadata.author_name?.trim() || undefined,
      authorUrl: metadata.author_url,
      thumbnailUrl: metadata.thumbnail_url || `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`,
    }
  } catch {
    throw createError({ statusCode: 422, statusMessage: 'We could not load that YouTube video. Check the link and try again.' })
  }
})
