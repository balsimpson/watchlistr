<template>
  <div>
    <section class="mx-auto max-w-6xl px-5 pb-16 pt-20 lg:px-8 lg:pt-28">
      <div class="max-w-3xl">
        <UBadge color="primary" variant="soft" size="sm">A shared place for your next watch</UBadge>
        <h1 class="mt-6 text-5xl font-semibold tracking-tight text-highlighted sm:text-7xl">
          Keep the good ones close.
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Search across movies, shows, and books. Save the titles worth remembering, then pick up your library wherever you use Watchlistr.
        </p>
      </div>

      <div class="mt-12 max-w-3xl">
        <UInput v-model="query" icon="i-lucide-search" size="xl" placeholder="Search movies, shows, or books" class="w-full" aria-label="Search movies, shows, or books" />
        <div class="mt-3 flex flex-wrap gap-2" aria-label="Search by type">
          <UButton v-for="option in kindOptions" :key="option.value" :color="kind === option.value ? 'primary' : 'neutral'" :variant="kind === option.value ? 'solid' : 'soft'" size="xs" :aria-pressed="kind === option.value" @click="setKind(option.value)">
            {{ option.label }}
          </UButton>
        </div>
      </div>

      <UAlert v-if="searchError" class="mt-6 max-w-3xl" color="error" variant="soft" title="Search is unavailable" :description="searchError" />

      <div v-if="searching" class="mt-12 flex items-center gap-3 text-sm text-muted">
        <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
        Searching the catalogue…
      </div>

      <section v-else-if="query.trim() && searchResults.length" class="mt-12" aria-labelledby="results-heading">
        <div class="mb-5 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-primary">Search results</p>
            <h2 id="results-heading" class="mt-1 text-2xl font-semibold text-highlighted">Titles to consider</h2>
          </div>
          <span class="text-sm text-muted">{{ searchResults.length }} matches</span>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <MediaTile v-for="item in searchResults" :key="item.uid" :item="item" :saved="savedUids.has(item.uid)" :pending="savingUid === item.uid" @save="handleSave(item)" @remove="handleRemove(item.uid)" />
        </div>
      </section>

      <EmptyState v-else-if="query.trim() && !searching" class="mt-12" icon="i-lucide-search-x" title="No matches yet" description="Try a broader title or choose another type." />
    </section>

    <section v-if="!query.trim()" class="border-t border-muted/70">
      <div class="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div class="flex items-end justify-between gap-6">
          <div>
            <p class="text-sm font-medium text-primary">From the community shelves</p>
            <h2 class="mt-1 text-3xl font-semibold text-highlighted">Worth your time</h2>
          </div>
          <UButton to="/user/watchlist" color="neutral" variant="link" trailing-icon="i-lucide-arrow-right">View my library</UButton>
        </div>

        <div v-if="discoverArticles.length" class="mt-10 border-b border-default pb-10">
          <div class="flex items-end justify-between gap-6">
            <div>
              <p class="text-sm font-medium text-primary">From the editorial desk</p>
              <h3 class="mt-1 text-2xl font-semibold text-highlighted">Notes worth keeping</h3>
            </div>
          </div>
          <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink v-for="article in discoverArticles" :key="article.id" :to="`/discover/${article.slug}`" class="group rounded-xl border border-default bg-elevated/40 p-5 transition hover:border-primary/40 hover:bg-elevated">
              <p class="text-xs font-medium uppercase tracking-[0.16em] text-dimmed">Editorial</p>
              <h4 class="mt-3 line-clamp-2 text-lg font-semibold leading-6 text-highlighted group-hover:text-primary">{{ article.title }}</h4>
              <p v-if="article.excerpt" class="mt-2 line-clamp-3 text-sm leading-6 text-muted">{{ article.excerpt }}</p>
              <span class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">Read article <UIcon name="i-lucide-arrow-up-right" class="size-4" /></span>
            </NuxtLink>
          </div>
        </div>

        <UAlert v-if="discoverError" class="mt-8" color="neutral" variant="soft" title="Curated picks are taking a break" description="You can still search and save titles above." />
        <div v-else-if="discoverItems.length" class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <MediaTile v-for="entry in discoverItems" :key="entry.id" :item="entry.item" :saved="savedUids.has(entry.item.uid)" :pending="savingUid === entry.item.uid" @save="handleSave(entry.item)" @remove="handleRemove(entry.item.uid)" />
        </div>
        <EmptyState v-else class="mt-8" icon="i-lucide-star" title="Curated picks will appear here" description="Search for a title to start building your library." />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { api } from '~~/convex/_generated/api'
import type { CatalogItem, CatalogKind, DiscoverArticle, DiscoverEntry } from '~/types/catalog'

useSeoMeta({
  title: 'Watchlistr — Keep the good ones close',
  description: 'Search movies, shows, and books, then save the titles worth remembering.',
})

const { $convex } = useNuxtApp()
const { isAuthenticated, isConfigured, loginWithRedirect } = useWatchlistrAuth()
const { savedUids, save, remove } = useWatchlistrLibrary()

const query = ref('')
const kind = ref<CatalogKind | 'all'>('all')
const searching = ref(false)
const searchError = ref('')
const searchResults = ref<CatalogItem[]>([])
const discoverItems = ref<DiscoverEntry[]>([])
const discoverArticles = ref<DiscoverArticle[]>([])
const discoverError = ref(false)
const savingUid = ref('')

const kindOptions: Array<{ value: CatalogKind | 'all'; label: string }> = [
  { value: 'all', label: 'Everything' },
  { value: 'movie', label: 'Movies' },
  { value: 'tv', label: 'Shows' },
  { value: 'book', label: 'Books' },
]

const setKind = (value: CatalogKind | 'all') => {
  kind.value = value
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
let stopDiscover: (() => void) | undefined
let stopArticles: (() => void) | undefined

watch([query, kind], () => {
  if (searchTimer) clearTimeout(searchTimer)
  const term = query.value.trim()
  searchError.value = ''
  if (!term) {
    searchResults.value = []
    searching.value = false
    return
  }
  if (term.length < 2) return

  searchTimer = setTimeout(async () => {
    searching.value = true
    try {
      const response = await $fetch<{ items: CatalogItem[]; errors: Record<string, string> }>('/api/catalog/search', {
        query: { q: term, kind: kind.value },
      })
      searchResults.value = response.items
      searchError.value = Object.values(response.errors)[0] ?? ''
    } catch (error) {
      searchError.value = error instanceof Error ? error.message : 'Could not search the catalogue.'
      searchResults.value = []
    } finally {
      searching.value = false
    }
  }, 350)
}, { immediate: true })

onMounted(() => {
  if (!$convex) {
    discoverError.value = true
    return
  }
  stopDiscover = $convex.onUpdate(api.discover.listPublished, {}, (entries) => {
    discoverItems.value = entries as DiscoverEntry[]
  }, () => {
    discoverError.value = true
  })
  stopArticles = $convex.onUpdate(api.discover.listPublishedArticles, {}, (articles) => {
    discoverArticles.value = articles as DiscoverArticle[]
  })
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  stopDiscover?.()
  stopArticles?.()
})

const handleSave = async (item: CatalogItem) => {
  if (!isConfigured) {
    searchError.value = 'Auth0 is not configured for this environment.'
    return
  }
  if (!isAuthenticated.value) {
    await loginWithRedirect()
    return
  }
  savingUid.value = item.uid
  try {
    await save(item)
  } finally {
    savingUid.value = ''
  }
}

const handleRemove = async (uid: string) => {
  savingUid.value = uid
  try {
    await remove(uid)
  } finally {
    savingUid.value = ''
  }
}
</script>
