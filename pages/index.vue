<template>
	<div class="max-w-4xl mx-auto p-4 mt-12">
		<div class="pb-12">
			<div class="text-3xl font-semibold text-stone-300">Mindfuck Movies</div>
			<AppCarousel :items="stonercomedies"/>
		</div>
		<div class="pb-12">
			<div class="text-3xl font-semibold text-stone-300">Stoner Comedies</div>
			<AppCarousel />
		</div>
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
	return items.value.filter(item => item.tags.includes("mindfuck"))
})
</script>