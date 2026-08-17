const youtubeHosts = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
])

export function parseYouTubeUrl(input: string): { url: string; videoId: string } | null {
  const value = input.trim()
  if (!value) return null

  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    if (!youtubeHosts.has(hostname)) return null

    const videoId = hostname === 'youtu.be'
      ? url.pathname.split('/').filter(Boolean)[0]
      : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1]

    if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null

    return {
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    }
  } catch {
    return null
  }
}
