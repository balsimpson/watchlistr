<template>
	<div class="max-w-4xl p-4 mx-auto mt-6">
		<div class="pb-4 text-center">
			<!-- <h2 class="text-base font-semibold leading-7 text-indigo-400">
				{{ genre }} Movies
			</h2> -->
			<p
				class="mt-2 mb-12 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl"
			>
			{{ genre }} Movies
			</p>
			<!-- <p class="mt-6 text-sm leading-5 text-gray-400">
				You can add up to 20 movies to your watchlist. This is deliberate.
				Nobody wants an endless list that you never watch. So choose carefully.
			</p> -->
		</div>
		<!-- <div class="pb-6 text-3xl font-bold text-stone-400">{{ genre }}</div> -->
		<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
			<AppCardImg v-for="item in items" :key="item" :item="item" />
		</div>

		<ScrollTop />
	</div>
</template>

<script setup>
	const route = useRoute();
	const genre = convertedStr(route.params.slug)
	const { data: items } = await useFetch(
		`/api/genre/?genre=${genre}`,
		{ initialCache: false }
	);
</script>

<style></style>
