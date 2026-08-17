<script setup lang="ts">
import { api } from '~~/convex/_generated/api'
import type { DiscoverArticle } from '~/types/catalog'
import { editorExtensions } from '~/utils/editor-extensions'

const route = useRoute()
const { $convex } = useNuxtApp()
const article = ref<DiscoverArticle | null>(null)
const isLoading = ref(true)
const error = ref('')
const slug = computed(() => String(route.params.slug ?? ''))
let stopArticle: (() => void) | undefined

onMounted(() => {
  if (!$convex) {
    error.value = 'This article could not be loaded right now.'
    isLoading.value = false
    return
  }

  stopArticle = $convex.onUpdate(api.discover.getPublishedArticle, { slug: slug.value }, (nextArticle) => {
    article.value = nextArticle as DiscoverArticle | null
    isLoading.value = false
    error.value = ''
  }, (nextError) => {
    error.value = nextError instanceof Error ? nextError.message : 'This article could not be loaded right now.'
    isLoading.value = false
  })
})

onUnmounted(() => stopArticle?.())

useSeoMeta({
  title: () => article.value ? `${article.value.title} — Watchlistr` : 'Editorial — Watchlistr',
  description: () => article.value?.excerpt ?? 'Watchlistr editorial notes.',
})
</script>

<template>
  <main>
    <UContainer class="max-w-4xl px-5 py-12 sm:py-16 lg:px-8">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-primary">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Back to Discover
      </NuxtLink>

      <div v-if="isLoading" class="mt-12 space-y-5">
        <USkeleton class="h-4 w-24" />
        <USkeleton class="h-12 w-4/5" />
        <USkeleton class="h-5 w-3/5" />
        <USkeleton class="h-96 w-full" />
      </div>

      <UAlert v-else-if="error || !article" class="mt-12" color="neutral" variant="soft" icon="i-lucide-file-question" title="Article not found" :description="error || 'This article is not published or no longer exists.'" />

      <article v-else class="mt-12">
        <header class="max-w-3xl">
          <p class="text-sm font-medium uppercase tracking-[0.16em] text-primary">Editorial</p>
          <h1 class="mt-4 text-4xl font-semibold tracking-tight text-highlighted sm:text-6xl">{{ article.title }}</h1>
          <p v-if="article.excerpt" class="mt-6 text-lg leading-8 text-muted sm:text-xl">{{ article.excerpt }}</p>
          <p class="mt-5 text-sm text-dimmed">Published {{ new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(article.publishedAt ?? article.createdAt) }}</p>
        </header>

        <div class="mt-12 overflow-hidden rounded-2xl border border-default bg-default shadow-sm">
          <ClientOnly>
            <UEditor
              :model-value="article.content"
              content-type="markdown"
              :editable="false"
              :starter-kit="{ dropcursor: false, gapcursor: false }"
              :extensions="editorExtensions"
              :ui="{ root: 'min-h-0', content: 'p-5 sm:p-10', base: 'max-w-3xl sm:px-0' }"
            />
            <template #fallback>
              <div class="p-5 text-sm text-muted sm:p-10">Opening the article…</div>
            </template>
          </ClientOnly>
        </div>
      </article>
    </UContainer>
  </main>
</template>
