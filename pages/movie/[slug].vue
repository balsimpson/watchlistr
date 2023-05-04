<template>
	<div
		v-if="post"
		class="flex flex-wrap items-center justify-center max-w-5xl mx-auto sm:mt-12 mt-3 p-3 sm:px-6"
	>
		<!-- <pre class="text-stone-400">{{ post }}</pre> -->
		<div class="grid gap-6 sm:grid-cols-2 text-stone-400">
			<div class="relative">
				<img
					class="object-cover object-center w-auto sm:h-full h-64 mx-auto rounded-lg"
					:alt="post.title"
					:src="getImageURL(post.poster_path)"
				/>
			</div>
			<div>
				<h1
					class="text-5xl font-bold leading-none tracking-tighter text-center sm:text-left md:text-6xl"
				>
					<span class="text-stone-300"> {{ post.title }} </span>
				</h1>
				<div class="text-sm space-x-6 text-center sm:text-left">
					<span class="italic">{{ post.release_date.split("-")[0] }}</span>
					<span>{{ post.runtime }} min</span>
					<span class="text-cyan-400">Movie</span>
				</div>

				<div class="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
					<TypeChip v-for="genre in post.genres"
					:key="post" :title="genre" />
				</div>

				<!-- <p
					class="mt-2 mb-4 text-sm leading-6 text-center text-stone-400 sm:text-left pt-3"
				>
					{{ post.overview }}
				</p> -->
				<div>
					<ul
						class="mt-2 mb-4 text-sm leading-6 text-center text-stone-400 sm:text-left pt-6"
					>
						<!-- loop through each crew member -->
						<li class="mb-2" v-for="member in post.crew" :key="member.name">
							<span class="font-bold">{{ member.job }}:</span> {{ member.name }}
						</li>
					</ul>

					<h2
						class="text-2xl font-bold leading-none tracking-tighter text-center text-stone-400 sm:text-left md:text-4xl mb-2"
					>
						Cast
					</h2>

					<div class="flex flex-wrap gap-x-3 justify-center sm:justify-start">
						<div v-for="item in post.cast" :key="item.name">
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const route = useRoute();

	const { data: post } = await useFetch(
		`/api/post/?slug=${route.params.slug}`,
		{ initialCache: false }
	);

	useHead({
		title: () => post?.value?.title,
		meta: [
			{
				name: "description",
				content: () => post?.value?.description,
			},
			{
				property: "og:title",
				content: () => post?.value?.title,
			},
			{
				property: "og:description",
				content: () => post?.value?.description,
			},
			{
				property: "og:image",
				content: () => post?.value?.image,
			},
			{
				property: "og:url",
				content: "https://manasasichrem.org/",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: () => post.value?.title,
			},
			{
				name: "twitter:description",
				content: () => post.value?.description,
			},
			{
				name: "twitter:image",
				content: () => post.value?.image,
			},
		],
	});
</script>

<style></style>
