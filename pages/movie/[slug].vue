<template>
	<div
		v-if="post"
		class="flex flex-wrap items-center justify-center max-w-4xl mx-auto sm:mt-12 mt-3 px-6"
	>
		<!-- <pre class="text-stone-400">{{ post }}</pre> -->
		<div class="grid gap-6 sm:grid-cols-6 text-stone-400 w-full">
			<div class="relative sm:col-span-2">
				<img
					class="object-cover object-center w-full mx-auto rounded-lg h-64 sm:h-auto"
					:alt="post.title"
					:src="getImageURL(post.poster_path)"
				/>

				<button
					@click.prevent="isModalActive = !isModalActive"
					class="flex items-center justify-center py-3 px-6 bg-amber-500 hover:bg-amber-600 text-stone-800 rounded-lg shadow-lg uppercase tracking-wider font-semibold text-sm sm:text-base transition duration-300 ease-in-out w-full mt-3"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>

					<span class="ml-3">Add to Watchlist</span>
				</button>
			</div>
			<div class="sm:col-span-4">
				<h1
					class="text-5xl font-bold leading-none tracking-tighter text-center sm:text-left md:text-6xl"
				>
					<span class="text-stone-300"> {{ post.title }} </span>
				</h1>
				<div class="text-base pt-3 space-x-6 text-center sm:text-left">
					<span class="italic">{{ post.release_date.split("-")[0] }}</span>
					<span>{{ post.runtime }} min</span>
					<span class="text-cyan-400">Movie</span>
				</div>

				<!-- <pre>{{ post }}</pre> -->

				<div class="mt-4">
					<h2
						class="text-xl font-semibold leading-none text-center text-stone-400 sm:text-left mb-2"
					>
						Language
					</h2>
					<p class="mb-4 leading-6 text-center text-stone-400 sm:text-left">
						{{ getSpokenLanguage(post.spoken_languages).join(", ") }}
					</p>
				</div>

				<div class="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
					<TypeChip v-for="genre in post.genres" :key="post" :title="genre" />
				</div>

				<p
					class="mt-2 mb-4 leading-6 text-center text-stone-400 sm:text-left pt-3"
				>
					{{ post.overview }}
				</p>

				<div>
					<h2
						class="text-2xl font-bold leading-none tracking-tighter text-center text-stone-400 sm:text-left md:text-4xl mb-2"
					>
						Crew
					</h2>
					<ul
						class="mt-2 mb-4 text-sm leading-6 text-center text-stone-400 sm:text-left"
					>
						<!-- loop through each crew member -->
						<li
							class="mb-2"
							v-for="member in getFormattedCrew(post.crew)"
							:key="member[0]"
						>
							<span class="font-bold">{{ member[0] }}:</span>
							{{ member[1].join(", ") }}
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

		<AppModal :isActive="isModalActive" @close="isModalActive = !isModalActive" class="flex items-center"> 
			<LoginForm />
		</AppModal>
	</div>
</template>

<script setup>
	const route = useRoute();
	const isModalActive = ref(false)
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
				content: () => post?.value?.overview,
			},
			{
				property: "og:image",
				content: () => getImageURL(post.value.poster_path),
			},
			{
				property: "og:url",
				content:
					"https://watchlistr.in/" +
					post.value.media_type +
					"/" +
					post.value.slug,
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
				content: () => post.value?.overview,
			},
			{
				name: "twitter:image",
				content: () => getImageURL(post.value.poster_path),
			},
		],
	});
</script>

<style></style>
