<template>
  <UCard class="group overflow-hidden ring-1 ring-default/10 transition hover:-translate-y-0.5 hover:ring-primary/50" :ui="{ body: 'p-0 sm:p-0' }">
    <div class="aspect-[2/3] overflow-hidden bg-elevated">
      <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
      <div v-else class="flex h-full items-center justify-center p-5 text-center text-sm text-muted">No cover available</div>
    </div>
    <div class="space-y-3 p-4">
      <div>
        <div class="mb-2 flex items-center gap-2">
          <UBadge :color="kindColor" variant="soft" size="xs">{{ kindLabel }}</UBadge>
          <span v-if="item.year" class="text-xs text-dimmed">{{ item.year }}</span>
        </div>
        <h3 class="line-clamp-2 font-semibold text-highlighted">{{ item.title }}</h3>
        <p v-if="item.creators.length" class="mt-1 line-clamp-1 text-xs text-muted">{{ item.creators.join(', ') }}</p>
      </div>

      <UButton v-if="saved" color="success" variant="soft" size="sm" block icon="i-lucide-check" :loading="pending" @click="$emit('remove')">
        Saved
      </UButton>
      <UButton v-else color="primary" variant="solid" size="sm" block icon="i-lucide-plus" :loading="pending" @click="$emit('save')">
        Save to library
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { CatalogItem } from '~/types/catalog'

const props = withDefaults(defineProps<{ item: CatalogItem; saved?: boolean; pending?: boolean }>(), {
  saved: false,
  pending: false,
})

defineEmits<{ save: []; remove: [] }>()

const kindLabel = computed(() => props.item.kind === 'tv' ? 'TV' : props.item.kind === 'movie' ? 'Movie' : 'Book')
const kindColor = computed(() => props.item.kind === 'movie' ? 'primary' : props.item.kind === 'tv' ? 'info' : 'success')
</script>
