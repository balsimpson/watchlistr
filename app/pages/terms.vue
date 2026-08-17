<script setup lang="ts">
import termsMarkdown from '../../TERMS.md?raw'
import LegalMarkdownPage from '~/components/LegalMarkdownPage.vue'

useSeoMeta({
  title: 'Terms of Service — Watchlistr',
  description: 'The terms that govern use of Watchlistr.',
})
</script>

<template>
  <LegalMarkdownPage :source="termsMarkdown" />
</template>
