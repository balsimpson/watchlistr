<template>
	<div
		class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
	>
		<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
			<div class="absolute inset-x-0 bottom-5">
				
				<div
					class="px-2 pb-4 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
				>
					{{item.item.title}}
				</div>

				<div class="flex flex-wrap justify-center gap-1 px-3">
					<TypeChip v-for="genre in item.item.genres" :key="item" :title="genre"/>
				</div>
			</div>
		</div>

		<img
			loading="lazy"
			:src="getImageURL(item.item.poster_path)"
			alt=""
			class="object-cover w-full rounded-lg h-76"
		/>
	</div>
</template>

<script lang="ts" setup>
defineProps(["item"])
</script>
