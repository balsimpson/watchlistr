<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { YouTubeEmbedData } from '~~/shared/types/editor'
import { decodeEditorPayload, encodeEditorPayload } from '~~/shared/types/editor'
import { parseYouTubeUrl } from '~~/shared/youtube'

const props = defineProps(nodeViewProps)

const fallback: YouTubeEmbedData = {
  url: '',
  videoId: '',
  title: 'YouTube video',
}

const data = computed(() => decodeEditorPayload<YouTubeEmbedData>(props.node.attrs.payload, fallback))
const isEditing = ref(false)
const editUrl = ref('')
const isSaving = ref(false)
const errorMessage = ref('')
const imageFailed = ref(false)
const canEdit = computed(() => props.editor.isEditable)

watch(data, (next) => {
  editUrl.value = next.url
  imageFailed.value = false
}, { immediate: true })

const openEditor = () => {
  editUrl.value = data.value.url
  errorMessage.value = ''
  isEditing.value = true
}

const saveVideo = async () => {
  const parsed = parseYouTubeUrl(editUrl.value)
  if (!parsed) {
    errorMessage.value = 'Paste a valid YouTube video link.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  try {
    const next = await $fetch<YouTubeEmbedData>('/api/embeds/youtube', {
      query: { url: editUrl.value },
    })
    props.updateAttributes({ payload: encodeEditorPayload(next) })
    isEditing.value = false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'That video could not be loaded.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <NodeViewWrapper
    class="my-6 overflow-hidden rounded-2xl border border-default bg-elevated transition-shadow"
    :class="selected ? 'ring-2 ring-primary/35' : 'shadow-sm'"
    data-content-block="youtube"
  >
    <div v-if="isEditing" class="space-y-4 p-4 sm:p-5" contenteditable="false">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-highlighted">Change video</p>
          <p class="mt-1 text-xs text-muted">Paste any YouTube watch, Shorts, or share link.</p>
        </div>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" aria-label="Cancel changing video" @mousedown.prevent @click.stop="isEditing = false" />
      </div>
      <UInput v-model="editUrl" icon="i-lucide-link" size="lg" placeholder="https://www.youtube.com/watch?v=…" class="w-full" @keydown.enter.prevent="saveVideo" />
      <p v-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</p>
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="ghost" size="sm" @mousedown.prevent @click.stop="isEditing = false">Cancel</UButton>
        <UButton color="primary" variant="solid" size="sm" :loading="isSaving" @mousedown.prevent @click.stop="saveVideo">Update video</UButton>
      </div>
    </div>

    <div v-else class="grid sm:grid-cols-[minmax(13rem,0.9fr)_1.1fr]" contenteditable="false">
      <a
        :href="data.url"
        target="_blank"
        rel="noopener noreferrer"
        class="group relative aspect-video overflow-hidden bg-stone-950 sm:aspect-auto"
        aria-label="Open video on YouTube"
        @mousedown.stop
      >
        <img
          v-if="data.thumbnailUrl && !imageFailed"
          :src="data.thumbnailUrl"
          :alt="data.title"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          @error="imageFailed = true"
        >
        <div v-else class="flex h-full min-h-40 items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgb(127_29_29),rgb(28_25_23)_70%)]">
          <UIcon name="i-lucide-youtube" class="size-10 text-white/80" />
        </div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/15 transition group-hover:bg-black/5">
          <span class="flex size-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition group-hover:scale-105">
            <UIcon name="i-lucide-play" class="ms-0.5 size-5 fill-current" />
          </span>
        </div>
      </a>

      <div class="flex min-w-0 flex-col justify-between gap-5 p-4 sm:p-5">
        <div>
          <div class="flex items-center gap-2">
            <UBadge color="error" variant="soft" size="xs" icon="i-lucide-youtube">YouTube</UBadge>
            <span class="text-xs text-dimmed">Video</span>
          </div>
          <h3 class="mt-3 line-clamp-2 text-base font-semibold leading-6 text-highlighted sm:text-lg">{{ data.title }}</h3>
          <p v-if="data.authorName" class="mt-1 line-clamp-1 text-sm text-muted">{{ data.authorName }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <UButton :href="data.url" target="_blank" rel="noopener noreferrer" color="error" variant="soft" size="sm" icon="i-lucide-external-link" @mousedown.stop>Open on YouTube</UButton>
          <UButton v-if="canEdit" color="neutral" variant="ghost" size="sm" icon="i-lucide-pencil" aria-label="Change video" @mousedown.prevent @click.stop="openEditor" />
          <UButton v-if="canEdit" color="neutral" variant="ghost" size="sm" icon="i-lucide-circle-x" aria-label="Remove video" @mousedown.prevent @click.stop="deleteNode" />
        </div>
      </div>
    </div>
  </NodeViewWrapper>
</template>
