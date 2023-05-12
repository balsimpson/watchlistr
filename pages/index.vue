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
		<div v-if="classics && classics.length" class="pb-12">
			<div class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0">Classics <span class="text-amber-500 ml-2 border border-amber-500 rounded px-2 py-1 text-xs">{{ classics.length }}</span></div>
			<AppCarousel :items="classics"/>
		</div>

		<div v-if="items" class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0">All Movies 
			<!-- <span class="text-amber-500 ml-2 border border-amber-500 rounded px-2 py-1 text-xs">{{ items.length }}</span> -->
		</div>
		<div v-if="items" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
			<div v-for="item in items">
				<!-- <NuxtLink v-if="item" :to="'/' + item.media_type + '/' + item.slug"> -->
					<AppCardImgTitle  :item="item"/>
				<!-- </NuxtLink> -->
			</div>
		</div>

		<div v-if="pending">Loading...</div>

		<ScrollTop />
	</div>
</template>

<script lang="ts" setup>
useHead({
		title: () => "Watchlistr.in - Movie Recommendations from Cultured Redditors",
		meta: [
			{
				name: "description",
				content: "From mind-bending thrillers to laugh out loud comedies, get hand-picked recommendations from cultured redditors.",
			},
			{
				property: "og:title",
				content: "Watchlistr.in - Movie Recommendations from Cultured Redditors",
			},
			{
				property: "og:description",
				content: "From mind-bending thrillers to laugh out loud comedies, get hand-picked recommendations from cultured redditors.",
			},
			{
				property: "og:image",
				content: "https://watchlistr.in/siteimage.png",
			},
			{
				property: "og:url",
				content:
					"https://watchlistr.in/"
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Watchlistr.in - Movie Recommendations from Cultured Redditors",
			},
			{
				name: "twitter:description",
				content: "From mind-bending thrillers to laugh out loud comedies, get hand-picked recommendations from cultured redditors.",
			},
			{
				name: "twitter:image",
				content: "https://watchlistr.in/siteimage.png",
			},
		],
	});
const { data: items, pending } = useFetch("/api/post")

const stonercomedies = computed(() => {
	// @ts-ignore
	return items.value.filter(item => item.tags.includes("stoner"))
})

const mindfuck = computed(() => {
	// @ts-ignore
	return items.value.filter(item => item.tags.includes("mindfuck"))
})

const classics = computed(() => {
	// @ts-ignore
	return items.value.filter(item => item.tags.includes("classic"))
})
</script>