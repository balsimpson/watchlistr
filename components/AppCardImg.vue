<template>
	<!-- <div @click="navigateTo('/' + item.media_type + '/' + item.slug)" class="cursor-pointer"> -->

	<div
		v-if="item"
		@click="navigateTo('/' + item.media_type + '/' + item.slug)"
		class="relative h-full overflow-hidden transition border border-transparent rounded-lg shadow cursor-pointer hover:border-amber-500"
	>
		<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
			<div class="absolute inset-x-0 bottom-2">
				<!-- <pre>{{ item }}</pre> -->
				

				<div class="flex flex-wrap justify-center gap-1 px-3 pb-2 text-xs z-60 text-stone-400">
					<span v-for="genre in item.genres"
						:key:string="genre"
						class="px-2 border rounded-full border-stone-700"	
					>{{ genre }}</span>
				</div>

				<NuxtLink
					:to="'/' + item.media_type + '/' + item.slug"
					class="flex justify-center px-2 pb-4 text-xl font-bold leading-5 text-center text-gray-200 capitalize hover:text-amber-500"
				>
					{{ item.title }}
				</NuxtLink>
			</div>
		</div>

		<img
			loading="lazy"
			:src="getImageURL(item.poster_path)"
			alt=""
			class="object-cover w-full rounded-lg h-76"
		/>
	</div>
</template>

<script lang="ts" setup>
	defineProps(["item"]);
</script>
