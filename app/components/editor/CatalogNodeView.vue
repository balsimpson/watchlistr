<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { CatalogEditorController, CatalogEmbedData } from '~~/shared/types/editor'
import { decodeEditorPayload } from '~~/shared/types/editor'

const props = defineProps(nodeViewProps)

const fallback: CatalogEmbedData = {
  uid: '',
  kind: 'movie',
  source: 'tmdb',
  sourceId: '',
  title: 'Untitled',
  creators: [],
}

const data = computed(() => decodeEditorPayload<CatalogEmbedData>(props.node.attrs.payload, fallback))
const imageFailed = ref(false)
const catalogController = computed(() => (props.editor.storage as { watchlistr?: CatalogEditorController }).watchlistr)
const canEdit = computed(() => props.editor.isEditable)
const canReplace = computed(() => canEdit.value && Boolean(catalogController.value?.openCatalog))

const kindLabel = computed(() => data.value.kind === 'movie' ? 'Movie' : data.value.kind === 'tv' ? 'TV show' : 'Book')
const kindColor = computed(() => data.value.kind === 'movie' ? 'primary' : data.value.kind === 'tv' ? 'info' : 'success')

const replaceItem = () => {
  catalogController.value?.openCatalog?.(data.value, props.updateAttributes)
}
</script>

<template>
  <NodeViewWrapper
    class="my-6 overflow-hidden rounded-2xl border border-default bg-elevated transition-shadow"
    :class="selected ? 'ring-2 ring-primary/35' : 'shadow-sm'"
    data-content-block="catalog"
  >
    <div class="flex gap-4 p-4 sm:gap-5 sm:p-5" contenteditable="false">
      <a
        v-if="data.imageUrl && !imageFailed"
        :href="data.externalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-default sm:h-36 sm:w-24"
        @mousedown.stop
      >
        <img :src="data.imageUrl" :alt="data.title" class="h-full w-full object-cover" loading="lazy" @error="imageFailed = true">
      </a>
      <div v-else class="flex h-28 w-20 shrink-0 items-center justify-center rounded-lg bg-default text-dimmed sm:h-36 sm:w-24">
        <UIcon :name="data.kind === 'book' ? 'i-lucide-book-open' : 'i-lucide-film'" class="size-7" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge :color="kindColor" variant="soft" size="xs">{{ kindLabel }}</UBadge>
            <span v-if="data.year" class="text-xs text-dimmed">{{ data.year }}</span>
          </div>
          <h3 class="mt-2 line-clamp-2 text-lg font-semibold leading-6 text-highlighted">{{ data.title }}</h3>
          <p v-if="data.creators.length" class="mt-1 line-clamp-1 text-sm text-muted">{{ data.creators.join(', ') }}</p>
          <p v-if="data.description" class="mt-2 line-clamp-2 text-sm leading-5 text-muted">{{ data.description }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-1">
          <UButton v-if="data.externalUrl" :href="data.externalUrl" target="_blank" rel="noopener noreferrer" color="neutral" variant="link" size="sm" trailing-icon="i-lucide-arrow-up-right" @mousedown.stop>View details</UButton>
          <UButton v-if="canReplace" color="neutral" variant="ghost" size="sm" icon="i-lucide-repeat-2" aria-label="Replace title" @mousedown.prevent @click.stop="replaceItem" />
          <UButton v-if="canEdit" color="neutral" variant="ghost" size="sm" icon="i-lucide-circle-x" aria-label="Remove title" @mousedown.prevent @click.stop="deleteNode" />
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>
