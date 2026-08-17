<script setup lang="ts">
import privacyMarkdown from '../../PRIVACY.md?raw'
import LegalMarkdownPage from '~/components/LegalMarkdownPage.vue'

useSeoMeta({
  title: 'Privacy Policy — Watchlistr',
  description: 'How Watchlistr handles information when you use the app.',
})
</script>

<template>
  <LegalMarkdownPage :source="privacyMarkdown" />
</template>
