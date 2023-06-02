<template>
	<!-- <div @click="navigateTo('/' + item.media_type + '/' + item.slug)" class="cursor-pointer"> -->

	<div v-if="item" class="relative h-full transition card" ref="el">
		<NuxtLink :to="'/' + item.media_type + '/' + item.slug">
			<img
				loading="lazy"
				:src="getImageURL(item.poster_path)"
				alt=""
				class="object-cover w-full h-full border border-transparent rounded-lg hover:border-amber-500"
			/>
		</NuxtLink>

		<!-- <NuxtLink
			:to="'/' + item.media_type + '/' + item.slug"
			class="absolute inset-x-0 flex justify-center px-2 pb-4 mt-3 text-xl leading-5 text-center text-gray-200 capitalize bottom-12 hover:text-amber-500"
		>
			{{ item.title }}
		</NuxtLink> -->
		<!-- <div class="flex flex-wrap justify-center gap-1 px-3 pt-3 z-60">
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

	const el = ref();
	onMounted(async () => {
		observeElements([el.value]);
	});
</script>

<style>
	html {
		scroll-behavior: smooth;
	}
	.card {
		/* Add your styles for the cards here */
		/* Initialize the card to be hidden */
		opacity: 0;
		transform: translateY(-50px);
		scale: 0;
		transition: opacity 0.5s, transform 0.5s;
	}
	
	/* Show the card when the visibility flag is set to true */
	.card.visible {
		opacity: 1;
		scale: 1;
		transform: translateY(0);
	}
</style>
