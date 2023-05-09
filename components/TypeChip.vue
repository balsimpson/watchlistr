<template>
	<NuxtLink :to="'/genre/'+createSlug(title)"
		class="inline-flex px-3 py-1 text-xs transition rounded-full text-stone-300 shrink-0 bg-stone-700 hover:bg-stone-300 hover:text-stone-600"
	>
		<span class="text-xs shadow-lg">{{ title }}</span>
	</NuxtLink>
	<!-- @click.prevent="navigateTo('/genre/'+genre)" -->
</template>

<script setup>
	const props = defineProps(["title"]);
</script>
