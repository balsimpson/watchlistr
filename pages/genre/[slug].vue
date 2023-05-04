<template>
	<div class="max-w-4xl mx-auto p-4 mt-12">
		<!-- <pre>{{ items }}</pre> -->
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			<AppCardImg v-for="item in items" :key="item" :item="item" />
		</div>
	</div>
</template>

<script setup>
	const route = useRoute();
	const genre = route.params.slug.charAt(0).toUpperCase() + route.params.slug.slice(1)
	const { data: items } = await useFetch(
		`/api/genre/?genre=${genre}`,
		{ initialCache: false }
	);
</script>

<style></style>
