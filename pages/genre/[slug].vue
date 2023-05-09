<template>
	<div class="max-w-4xl mx-auto p-4 mt-6">
		
		<div class="text-3xl text-stone-400 font-bold pb-6">{{ genre }}</div>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			<AppCardImg v-for="item in items" :key="item" :item="item" />
		</div>
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
