<template>
	<div class="relative">
		<div class="flex items-center">
			<input
				@keypress.enter="titleSearch(0)"
				@keyup="titleSearch"
				v-model="queryInput"
				type="text"
				autocomplete="true"
				class="w-full px-3 py-3 placeholder-gray-500 transition border font-black-bold text-zinc-500 border-zinc-300 bg-zinc-50 focus:outline-none"
				:class="[searchResults.length ? 'rounded-t' : 'rounded']"
				placeholder="Search by title"
			/>

			<!-- btn to clear results -->
			<button
				@click="clearResults"
				class="absolute inset-y-0 px-4 text-gray-500 right-8 focus:outline-none focus:ring-1 focus:ring-zinc-500"
				:class="[searchResults.length ? 'opacity-100' : 'opacity-0']"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-4 h-4"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<div class="absolute inset-y-0 right-0">
				<div
					@click.prevent="search"
					class="flex items-center h-full px-2 transition cursor-pointer text-zinc-500 hover:text-brand-500"
				>
					<svg
						v-if="!isSearching"
						xmlns="http://www.w3.org/2000/svg"
						class="w-6 h-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>

					<svg
						v-else
						class="w-6 h-6 animate-spin"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-50"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<!-- add a dropdown -->
		<div
			v-if="searchResults.length && queryInput"
			class="absolute top-[52px] z-10 w-full overflow-y-scroll bg-white border border-zinc-200 divide-zinc-200 divide-y rounded-b max-h-64 snap-y"
		>
			<div
				v-for="result in searchResults"
				@click="selectOption(result)"
				class="px-2 py-1 transition cursor-pointer hover:bg-zinc-300 snap-start"
			>
				<div class="flex items-center p-3">
					<div v-if="result.poster_path" class="w-12 h-12 mr-3 shrink-0">
						<img
							:src="getImageURL(result.poster_path, 'small')"
							alt=""
							class="object-cover w-full h-full rounded"
						/>
					</div>
					<div class="text-zinc-500">
						<div class="text-xl font-bold leading-5">
							{{ result.title || result.name }}
							<span
								class="font-light"
								v-if="result.first_air_date || result.release_date"
							>
								{{ getYear(result.first_air_date || result.release_date) }}
							</span>
						</div>
						<div class="flex items-center">
							<!-- <span
								v-if="result.original_language"
								class="mr-2 text-sm italic text-zinc-500"
							>
								{{ getLanguage(result.original_language) }}
							</span> -->
							<span
								v-if="result.genres && result.genres.length"
								class="px-2 py-1 text-xs font-medium tracking-wide uppercase rounded text-zinc-500 bg-zinc-300"
							>
								{{ result.genres.join(", ") }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			v-else-if="queryInput"
			@click.prevent="movieSearch(queryInput)"
			class="absolute top-[52px] z-10 w-full overflow-y-scroll bg-zinc-200 border-zinc-500 divide-zinc-500 divide-y rounded-b max-h-64 snap-y"
		>
			<div
				class="px-2 py-1 text-gray-500 transition cursor-pointer hover:bg-zinc-300 snap-start"
			>
				Search for {{ queryInput }}
			</div>
		</div>

		<!-- <pre> {{ selectedItem }}</pre> -->
	</div>
</template>

<script setup>
	const emit = defineEmits(["selected"])
	
	const queryInput = ref("");
	const searchResults = ref([]);
	const isSearching = ref(false);
	const searchErrorMsg = ref("");
	const errorMessage = ref("");
	const successMessage = ref("");
	const selectedItem = ref()

	const { data: items } = await useFetch("/api/media");

	const titleSearch = () => {
		console.log("search");
		const searchByTitle = fuzzy(items.value, "title");
		searchResults.value = searchByTitle(queryInput.value);
	};

	const movieSearch = async (query) => {
		console.log("query", query);
		try {
			let results = await search(query, "movie");
			// queryString.value = val;
			isSearching.value = true;

			if (results && results.results.length > 0) {
				console.log("results", results.results);
				searchResults.value = results.results;
			} else {
				searchErrorMsg.value = "No results found";

				setTimeout(() => {
					searchErrorMsg.value = "";
				}, 4000);
			}
			isSearching.value = false;
		} catch (error) {
			console.log("doSearch-error", error);
		}
	};

	const selectOption = async (option) => {
		searchResults.value = [];
		console.log("selected", option.id);

		let res = await getFormattedMovieDetails(option.id);
		let genres = getGenreText(res.genres);
		res.genres = genres;
		
		selectedItem.value = res;
		console.log("selected", selectedItem.value);
		// emit("selected", res);
		await addToList()
	};

	const addToList = async () => {
		const slug = createSlug(
			selectedItem.value.title,
			selectedItem.value.release_date.split("-")[0]
		);
		const data = {
			created_at: Date.now(),
			comment: "",
			comments: [],
			tags: [],
			slug: slug,
			...selectedItem.value,
		};

		let docExists = await checkIfDocExists(selectedItem.value.imdb_id, "media");

		// console.log("exists", docExists);

		if (docExists) {
			// console.log("no");
			errorMessage.value = "Duplicate! Item already added.";

			setTimeout(() => {
				errorMessage.value = "";
			}, 5000);
		} else {
			let result = await addDocWithId(
				"media",
				data,
				selectedItem.value.imdb_id
			);
			console.log("result", result);
			selectedItem.value = "";
			successMessage.value = "Successfully added.";

			setTimeout(() => {
				successMessage.value = "";
			}, 5000);
		}
	};

	const clearResults = () => {
		searchResults.value = [];
		queryInput.value = "";
	};

	onMounted(() => {});
</script>
