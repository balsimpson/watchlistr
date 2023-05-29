<template>
	<div class="">
		<!-- Card Blog -->
		<div
			class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto border border-stone-800 shadow-lg rounded-lg bg-gradient-to-b from-zinc-600/[.15] via-transparent bg-black"
		>
			<!-- Grid -->
			<div class="grid gap-8 sm:grid-cols-2 sm:items-center">
				<div class="sm:order-2">
					<div class="relative pt-[50%] sm:pt-[100%] rounded-lg">
						<img
							class="absolute top-0 left-0 object-cover w-full h-full rounded-lg"
							:src="posts[0].image"
							alt="Image Description"
						/>
					</div>
				</div>
				<!-- End Col -->

				<div class="sm:order-1">
					<p
						class="mb-5 inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-gray-600 text-gray-300"
					>
						Featured
					</p>

					<h2
						class="text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl lg:leading-tight xl:text-5xl xl:leading-tight dark:text-gray-200"
					>
						<NuxtLink
							class="transition hover:text-amber-200"
							:to="'/blog/' + posts[0].slug"
						>
							{{ posts[0].title }}
						</NuxtLink>
					</h2>

					<div class="mt-5">
						<NuxtLink
							class="inline-flex items-center gap-x-1.5 text-gray-500 decoration-2 hover:underline font-medium"
							:to="'/blog/' + posts[0].slug"
						>
							Read more
							<svg
								class="w-2.5 h-2.5"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</NuxtLink>
					</div>
				</div>
				<!-- End Col -->
			</div>
			<!-- End Grid -->
		</div>
		<!-- End Card Blog -->

		<div
			v-if="trending && trending.length"
			class="max-w-4xl px-2 py-6 mx-auto sm:px-4"
		>
			<div
				class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0"
			>
				Trending
				<span
					class="px-2 py-1 ml-2 text-xs border rounded text-amber-500 border-amber-500"
					>{{ trending.length }}</span
				>
			</div>
			<AppCarousel :items="trending" />
		</div>
		<div
			v-if="stonercomedies && stonercomedies.length"
			class="max-w-4xl px-2 py-6 mx-auto sm:px-4"
		>
			<div
				class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0"
			>
				Stoner Comedies
				<span
					class="px-2 py-1 ml-2 text-xs border rounded text-amber-500 border-amber-500"
					>{{ stonercomedies.length }}</span
				>
			</div>
			<AppCarousel :items="stonercomedies" />
		</div>
		<div
			v-if="mindfuck && mindfuck.length"
			class="max-w-4xl px-2 py-6 mx-auto sm:px-4"
		>
			<div
				class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0"
			>
				Mindfuck Movies
				<span
					class="px-2 py-1 ml-2 text-xs border rounded text-amber-500 border-amber-500"
					>{{ mindfuck.length }}</span
				>
			</div>
			<AppCarousel :items="mindfuck" />
		</div>
		<div
			v-if="classics && classics.length"
			class="max-w-4xl px-2 py-6 mx-auto sm:px-4"
		>
			<div
				class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0"
			>
				Classics
				<span
					class="px-2 py-1 ml-2 text-xs border rounded text-amber-500 border-amber-500"
					>{{ classics.length }}</span
				>
			</div>
			<AppCarousel :items="classics" />
		</div>

		<!-- <pre class="text-zinc-500">{{ items[0] }}</pre> -->

		<div class="pb-4 text-center">
			<h2 class="text-base font-semibold leading-7 text-indigo-400">
				All Movies
			</h2>
			<p
				class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl"
			>
				Handpicked movies from cultured Redditors.
			</p>
			<!-- <p class="mt-6 text-sm leading-5 text-gray-400">
				You can add up to 20 movies to your watchlist. This is deliberate.
				Nobody wants an endless list that you never watch. So choose carefully.
			</p> -->
		</div>

		<div
			class="sticky z-20 p-4 rounded-lg -top-1 bg-stone-900/90 bg-gradient-to-tl from-purple-600/[.15] via-transparent py-6 max-w-4xl mx-auto mb-4"
		>
			<div
				class="flex flex-wrap items-center justify-center max-w-3xl gap-2 mx-auto"
			>
				<span
					@click="filteredItems = filterByGenre(items, '')"
					class="inline-flex px-3 py-1 text-xs transition rounded-full cursor-pointer text-stone-300 shrink-0 hover:bg-stone-300 hover:text-stone-600"
					:class="[
						filteredGenre == 'All'
							? 'bg-stone-300 text-stone-600'
							: 'bg-stone-700',
					]"
					>All</span
				>

				<span
					v-for="item in uniqueGenres"
					@click="filteredItems = filterByGenre(items, item)"
					class="inline-flex px-3 py-1 text-xs transition rounded-full cursor-pointer shrink-0 hover:bg-stone-300 hover:text-stone-600"
					:class="[
						filteredGenre == item
							? 'bg-stone-300 text-stone-600'
							: 'bg-stone-700 text-stone-300',
					]"
					>{{ item }}</span
				>
			</div>
		</div>

		<!-- <div
			v-if="items"
			class="md:text-[1.8vw] font-semibold text-stone-300 flex items-center shrink-0"
		>
			All Movies
			<span class="px-2 py-1 ml-2 text-xs border rounded text-amber-500 border-amber-500">{{ items.length }}</span>
		</div> -->
		<div
			v-if="items"
			class="grid max-w-4xl grid-cols-2 gap-6 px-2 mx-auto md:grid-cols-3 lg:grid-cols-4 gap-y-8"
		>
			<div v-for="item in filteredItems">
				<!-- <NuxtLink v-if="item" :to="'/' + item.media_type + '/' + item.slug"> -->
				<AppCardImgTitle :item="item" />
				<!-- </NuxtLink> -->
			</div>
		</div>

		<div v-if="pending">Loading...</div>

		<ScrollTop />
	</div>
</template>

<script lang="ts" setup>
	useHead({
		title: () =>
			"Watchlistr.in - Movie Recommendations from Cultured Redditors",
		meta: [
			{
				name: "description",
				content:
					"From mind-bending thrillers to laugh out loud comedies, get hand-picked recommendations from cultured redditors.",
			},
			{
				property: "og:title",
				content:
					"Watchlistr.in - Movie Recommendations from Cultured Redditors",
			},
			{
				property: "og:description",
				content:
					"From mind-bending thrillers to laugh out loud comedies, get hand-picked recommendations from cultured redditors.",
			},
			{
				property: "og:image",
				content: "https://watchlistr.in/siteimage.png",
			},
			{
				property: "og:url",
				content: "https://watchlistr.in/",
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content:
					"Watchlistr.in - Movie Recommendations from Cultured Redditors",
			},
			{
				name: "twitter:description",
				content:
					"From mind-bending thrillers to laugh out loud comedies, get hand-picked recommendations from cultured redditors.",
			},
			{
				name: "twitter:image",
				content: "https://watchlistr.in/siteimage.png",
			},
		],
	});
	const { data: items, pending } = useFetch("/api/media");

	const filteredItems = ref([]);
	const filteredGenre = ref("All");

	const stonercomedies = computed(() => {
		// @ts-ignore
		if (items.value && items.value.length) {
			// @ts-ignore
			return items.value.filter((item) => item.tags.includes("stoner"));
		}
	});

	const { data: posts, error } = await useAsyncData("blog", () =>
		$fetch("/api/blog")
	);

	const mindfuck = computed(() => {
		// @ts-ignore
		if (items.value && items.value.length) {
			// @ts-ignore
			return items.value.filter((item) => item.tags.includes("mindfuck"));
		}
	});

	const classics = computed(() => {
		// @ts-ignore
		if (items.value && items.value.length) {
			// @ts-ignore
			return items.value.filter((item) => item.tags.includes("classic"));
		}
	});

	const trending = computed(() => {
		let res = [];
		// @ts-ignore
		if (items.value && items.value.length) {
			res = items.value.filter((item: { views: any; }, index: number) => item.views && index < 20)
			// @ts-ignore
			return res.sort((a, b) => a.views - b.views);

			
		}
	});

	// const genres = computed(() => {
	// 	// @ts-ignore
	// 	if (items.value && items.value.length) {
	// 		// @ts-ignore
	// 		// return items.value.filter((item) => {

	// 		// 	if (item.genres) {
	// 		// 		console.log(item.genres);
	// 		// 		return item.genres;
	// 		// 	}
	// 		// });

	// 		return items.value.filter((item) => {
	// 			if (item.genres) {
	// 				console.log(item.genres);
	// 				return item.genres; // Change this line to "return item.genres;"
	// 			}
	// 		});
	// 	}
	// });

	const uniqueGenres = computed(() => {
		// @ts-ignore
		if (items.value && items.value.length) {
			// @ts-ignore
			const genresArray = items.value
				.filter((item: { genres: any; }) => item.genres) // Filter out items with no genres property
				.map((item: { genres: any; }) => item.genres); // Map the remaining items to their genres values

			let _genresArray = genresArray.flat();
			const uniqueSet = new Set(_genresArray); // Create a Set from the genresArray
			// return Array.from(uniqueSet); // Convert the Set back to an array

			const sortedArray = Array.from(uniqueSet).sort(); // Sort the array alphabetically
			return sortedArray;
		}
	});

	const filterByGenre = (array: [], genre: string) => {
		if (genre) {
			filteredGenre.value = genre;
			return array.filter((item) => {
				// @ts-ignore
				return item.genres.includes(genre);
			});
		} else {
			filteredGenre.value = "All";
			return array;
		}
	};

	onMounted(() => {
		filteredItems.value = filterByGenre(items.value, "");
	});
</script>
