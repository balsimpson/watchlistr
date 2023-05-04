<template>
	<div class="max-w-4xl mx-auto p-4 mt-12">
		

		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
			<AppCardImg v-for="item in items" :key="item" :item="item"/>

		</div>
	</div>
</template>

<script lang="ts" setup>
const { data: items } = useFetch("/api/post")
</script>