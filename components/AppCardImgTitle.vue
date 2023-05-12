<template>
	<!-- <div @click="navigateTo('/' + item.media_type + '/' + item.slug)" class="cursor-pointer"> -->

	<div v-if="item" class="relative transition h-full">
		<NuxtLink :to="'/' + item.media_type + '/' + item.slug">
			<img
				loading="lazy"
				:src="getImageURL(item.poster_path)"
				alt=""
				class="object-cover w-full rounded-lg h-full hover:border-amber-500 border border-transparent"
			/>
		</NuxtLink>

		<!-- <NuxtLink
			:to="'/' + item.media_type + '/' + item.slug"
			class="absolute bottom-12 inset-x-0 px-2 pb-4 leading-5 text-center text-gray-200 capitalize text-xl flex justify-center hover:text-amber-500 mt-3"
		>
			{{ item.title }}
		</NuxtLink> -->
		<!-- <div class="flex flex-wrap justify-center gap-1 px-3 z-60 pt-3">
			<TypeChip
				v-for="genre in item.genres"
				:key:string="genre"
				:title="genre"
			/>
		</div> -->
	</div>
</template>

<script lang="ts" setup>
	defineProps(["item"]);
</script>
