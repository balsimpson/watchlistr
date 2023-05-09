<template>
	<div class="max-w-4xl mx-auto p-4 mt-12">
		<div v-if="stonercomedies && stonercomedies.length" class="pb-12">
			<div class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0">Stoner Comedies <span class="text-amber-500 ml-2 border border-amber-500 rounded px-2 py-1 text-xs">{{ stonercomedies.length }}</span></div>
			<AppCarousel :items="stonercomedies"/>
		</div>
		<div v-if="mindfuck && mindfuck.length" class="pb-12">
			<div class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0">Mindfuck Movies <span class="text-amber-500 ml-2 border border-amber-500 rounded px-2 py-1 text-xs">{{ mindfuck.length }}</span></div>
			<AppCarousel :items="mindfuck"/>
		</div>

		<div v-if="items" class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0">All Movies <span class="text-amber-500 ml-2 border border-amber-500 rounded px-2 py-1 text-xs">{{ items.length }}</span></div>
		<div v-if="items" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			<div v-for="item in items">
				<!-- <NuxtLink v-if="item" :to="'/' + item.media_type + '/' + item.slug"> -->
					<AppCardImg  :item="item"/>
				<!-- </NuxtLink> -->
			</div>
		</div>

		<div v-if="pending">Loading...</div>
	</div>
</template>

<script lang="ts" setup>
const { data: items, pending } = useFetch("/api/post")

const stonercomedies = computed(() => {
	// @ts-ignore
	return items.value.filter(item => item.tags.includes("stoner"))
})

const mindfuck = computed(() => {
	// @ts-ignore
	return items.value.filter(item => item.tags.includes("mindfuck"))
})
</script>