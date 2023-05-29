<template>
	<div
    v-if="id && data && data.results.length"
		class="max-w-4xl px-2 py-6 mx-auto sm:px-4"
	>

    <!-- <pre class="text-2xl text-stone-300">data {{ data }}</pre> -->
		<div
			class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0"
		>
			Similar
			<span
				class="px-2 py-1 ml-2 text-xs border rounded text-amber-500 border-amber-500"
				>{{ data.results.length }}</span
			>
		</div>
		<AppCarousel :items="data.results" />
	</div>
</template>

<script setup>
const props = defineProps(["id"])
const { data } = useFetch(`https://api.themoviedb.org/3/movie/${props.id}/similar?api_key=bcde1195dc8ce8278f7fd88e160d3d72`)
</script>
