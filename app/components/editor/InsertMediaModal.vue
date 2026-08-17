<script setup lang="ts">
import type { CatalogItem } from '~/types/catalog'
import type { CatalogEmbedData, YouTubeEmbedData } from '~~/shared/types/editor'
import { parseYouTubeUrl } from '~~/shared/youtube'

type InsertKind = 'youtube' | 'catalog'

const props = withDefaults(defineProps<{
  open: boolean
  kind: InsertKind
  youtubeInitial?: YouTubeEmbedData | null
  catalogInitial?: CatalogEmbedData | null
}>(), {
  youtubeInitial: null,
  catalogInitial: null,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'insert-youtube': [value: YouTubeEmbedData]
  'insert-catalog': [value: CatalogItem]
}>()

const modalOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value),
})

const youtubeUrl = ref('')
const youtubePreview = ref<YouTubeEmbedData | null>(null)
const youtubeError = ref('')
const youtubeLoading = ref(false)

const catalogQuery = ref('')
const catalogKind = ref<'all' | 'movie' | 'tv' | 'book'>('all')
const catalogResults = ref<CatalogItem[]>([])
const catalogError = ref('')
const catalogLoading = ref(false)
let catalogSearchTimer: ReturnType<typeof setTimeout> | undefined
let catalogRequestId = 0

const title = computed(() => props.kind === 'youtube' ? 'Add a YouTube video' : 'Add a title from the catalogue')
const description = computed(() => props.kind === 'youtube'
  ? 'Turn a video link into a rich editorial block.'
  : 'Choose a movie, TV show, or book to place in your article.')
const catalogKinds = [
  { value: 'all' as const, label: 'Everything' },
  { value: 'movie' as const, label: 'Movies' },
  { value: 'tv' as const, label: 'TV' },
  { value: 'book' as const, label: 'Books' },
]

function resetForm() {
  youtubeUrl.value = props.youtubeInitial?.url || ''
  youtubePreview.value = props.youtubeInitial
  youtubeError.value = ''
  youtubeLoading.value = false

  catalogQuery.value = props.catalogInitial?.title || ''
  catalogResults.value = []
  catalogError.value = ''
  catalogLoading.value = false

  if (props.kind === 'catalog' && props.catalogInitial?.title) {
    queueCatalogSearch()
  }
}

function queueCatalogSearch() {
  if (catalogSearchTimer) clearTimeout(catalogSearchTimer)
  catalogSearchTimer = setTimeout(searchCatalog, 280)
}

async function searchCatalog() {
  const term = catalogQuery.value.trim()
  catalogError.value = ''
  if (term.length < 2) {
    catalogResults.value = []
    return
  }

  const requestId = ++catalogRequestId
  catalogLoading.value = true
  try {
    const response = await $fetch<{ items: CatalogItem[]; errors: Record<string, string> }>('/api/catalog/search', {
      query: { q: term, kind: catalogKind.value },
    })
    if (requestId !== catalogRequestId) return
    catalogResults.value = response.items
    catalogError.value = Object.values(response.errors)[0] || ''
  } catch (error) {
    if (requestId !== catalogRequestId) return
    catalogResults.value = []
    catalogError.value = error instanceof Error ? error.message : 'The catalogue search failed.'
  } finally {
    if (requestId === catalogRequestId) catalogLoading.value = false
  }
}

function handleCatalogInput() {
  queueCatalogSearch()
}

function setCatalogKind(kind: typeof catalogKind.value) {
  catalogKind.value = kind
  queueCatalogSearch()
}

async function loadYouTubePreview() {
  const parsed = parseYouTubeUrl(youtubeUrl.value)
  youtubeError.value = ''
  if (!parsed) {
    youtubePreview.value = null
    youtubeError.value = 'Paste a valid YouTube video link.'
    return
  }

  youtubeLoading.value = true
  try {
    youtubePreview.value = await $fetch<YouTubeEmbedData>('/api/embeds/youtube', {
      query: { url: youtubeUrl.value },
    })
  } catch (error) {
    youtubePreview.value = null
    youtubeError.value = error instanceof Error ? error.message : 'That video could not be loaded.'
  } finally {
    youtubeLoading.value = false
  }
}

function handleYoutubeInput() {
  youtubePreview.value = null
  youtubeError.value = ''
}

function insertYouTube() {
  if (youtubePreview.value) emit('insert-youtube', youtubePreview.value)
}

function selectCatalog(item: CatalogItem) {
  emit('insert-catalog', item)
}

watch(() => [props.open, props.kind, props.youtubeInitial?.url, props.catalogInitial?.uid], () => {
  if (props.open) resetForm()
})

onUnmounted(() => {
  if (catalogSearchTimer) clearTimeout(catalogSearchTimer)
})
</script>

<template>
  <UModal v-model:open="modalOpen" :title="title" :description="description" :ui="{ content: 'sm:max-w-xl' }">
    <template #body>
      <div v-if="kind === 'youtube'" class="space-y-5">
        <div class="flex gap-3 rounded-xl bg-elevated/70 p-3.5 text-sm leading-5 text-muted">
          <UIcon name="i-lucide-sparkles" class="mt-0.5 size-4 shrink-0 text-primary" />
          <p>We’ll fetch the video title and channel, then save a lightweight preview in your draft.</p>
        </div>

        <UFormField label="YouTube link" hint="Watch, Shorts, or share links are supported.">
          <UInput v-model="youtubeUrl" icon="i-lucide-link" size="lg" autofocus placeholder="https://www.youtube.com/watch?v=…" class="w-full" @input="handleYoutubeInput" @keydown.enter.prevent="loadYouTubePreview" />
        </UFormField>

        <UAlert v-if="youtubeError" color="error" variant="soft" icon="i-lucide-circle-alert" title="Video not ready" :description="youtubeError" />

        <div v-if="youtubePreview" class="overflow-hidden rounded-xl border border-default bg-elevated">
          <div class="grid sm:grid-cols-[12rem_1fr]">
            <div class="aspect-video bg-stone-950 sm:aspect-auto">
              <img v-if="youtubePreview.thumbnailUrl" :src="youtubePreview.thumbnailUrl" :alt="youtubePreview.title" class="h-full w-full object-cover" loading="lazy">
              <div v-else class="flex h-full min-h-32 items-center justify-center"><UIcon name="i-lucide-youtube" class="size-8 text-white/70" /></div>
            </div>
            <div class="space-y-2 p-4">
              <UBadge color="error" variant="soft" size="xs" icon="i-lucide-youtube">YouTube</UBadge>
              <p class="line-clamp-2 font-semibold leading-5 text-highlighted">{{ youtubePreview.title }}</p>
              <p v-if="youtubePreview.authorName" class="text-sm text-muted">{{ youtubePreview.authorName }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="modalOpen = false">Cancel</UButton>
          <UButton v-if="!youtubePreview" color="primary" variant="solid" :loading="youtubeLoading" icon="i-lucide-scan-search" @click="loadYouTubePreview">Preview video</UButton>
          <UButton v-else color="primary" variant="solid" icon="i-lucide-plus" @click="insertYouTube">Add video</UButton>
        </div>
      </div>

      <div v-else class="space-y-5">
        <div class="space-y-3">
          <UInput v-model="catalogQuery" icon="i-lucide-search" size="lg" autofocus placeholder="Search by title" class="w-full" @input="handleCatalogInput" @keydown.enter.prevent="searchCatalog" />
          <div class="flex flex-wrap gap-1.5" aria-label="Filter catalogue search">
            <UButton
              v-for="option in catalogKinds"
              :key="option.value"
              :color="catalogKind === option.value ? 'primary' : 'neutral'"
              :variant="catalogKind === option.value ? 'soft' : 'ghost'"
              size="xs"
              :aria-pressed="catalogKind === option.value"
              @click="setCatalogKind(option.value)"
            >
              {{ option.label }}
            </UButton>
          </div>
        </div>

        <UAlert v-if="catalogError" color="error" variant="soft" icon="i-lucide-circle-alert" title="Search is unavailable" :description="catalogError" />

        <div v-if="catalogLoading" class="flex items-center justify-center gap-2 py-12 text-sm text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
          Searching the catalogue…
        </div>
        <div v-else-if="catalogResults.length" role="listbox" aria-label="Catalogue results" class="max-h-80 divide-y divide-default overflow-y-auto rounded-xl border border-default">
          <button
            v-for="item in catalogResults"
            :key="item.uid"
            type="button"
            role="option"
            class="flex w-full items-center gap-3 p-3 text-start transition hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none"
            @click="selectCatalog(item)"
          >
            <div class="h-16 w-11 shrink-0 overflow-hidden rounded bg-default">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover" loading="lazy">
              <div v-else class="flex h-full items-center justify-center"><UIcon name="i-lucide-film" class="size-4 text-dimmed" /></div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge :color="item.kind === 'movie' ? 'primary' : item.kind === 'tv' ? 'info' : 'success'" variant="soft" size="xs">{{ item.kind === 'movie' ? 'Movie' : item.kind === 'tv' ? 'TV' : 'Book' }}</UBadge>
                <span v-if="item.year" class="text-xs text-dimmed">{{ item.year }}</span>
              </div>
              <p class="mt-1 line-clamp-1 font-medium text-highlighted">{{ item.title }}</p>
              <p v-if="item.creators.length" class="mt-0.5 line-clamp-1 text-xs text-muted">{{ item.creators.join(', ') }}</p>
            </div>
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-dimmed" />
          </button>
        </div>
        <div v-else class="rounded-xl border border-dashed border-default px-5 py-10 text-center">
          <UIcon name="i-lucide-library" class="mx-auto size-7 text-dimmed" />
          <p class="mt-3 text-sm font-medium text-highlighted">Search for a title to add</p>
          <p class="mt-1 text-sm text-muted">Movies, TV shows, and books are all in one place.</p>
        </div>
      </div>
    </template>
  </UModal>
</template>
