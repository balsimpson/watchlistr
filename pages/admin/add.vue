<template>
	<div class="flex flex-col h-full max-w-2xl p-4 mx-auto">
		<div class="overflow-y-scroll grow">
			<p>Search</p>

			<SearchWithDropdown
				@keyup="publishStatus = false"
				class="z-60"
				@search="doSearch($event)"
				@selected="clickHandler($event)"
				@clear="searchResults = []"
				placeholder="try 'The Matrix'"
				:searchResults="searchResults"
				:isSearching="isSearching"
			>
			</SearchWithDropdown>

			<!-- result -->

			<!-- <pre>{{ selectedItem }}</pre> -->
			<div
				v-if="selectedItem"
				class="flex flex-wrap items-center max-w-5xl mx-auto mt-3 sm:mt-12"
			>
				<div class="grid gap-12 text-gray-700 sm:grid-cols-2">
					<div class="relative">
						<img
							class="object-cover object-center w-full mx-auto rounded-lg sm:h-auto h-96"
							:alt="selectedItem.title"
							:src="getImageURL(selectedItem.poster_path)"
						/>
					</div>
					<div>
						<h1
							class="text-5xl font-bold leading-none tracking-tighter text-center text-yellow-500 sm:text-left md:text-6xl"
						>
							<span class="text-gray-700"> {{ selectedItem.title }} </span>
						</h1>

						<p
							class="pt-6 mt-2 mb-4 text-sm leading-6 text-center text-gray-700 sm:text-left"
						>
							{{ selectedItem.overview }}
						</p>

						<TagInput
							@updated="addTags"
							:suggestions="tagSuggestions"
							class="py-2 border-t"
						/>

						<textarea
							class="w-full p-3 border rounded-md"
							rows="5"
							v-model="itemComment"
							placeholder="Your comments"
						></textarea>
					</div>
				</div>
			</div>
		</div>
		<div>
			<div
				v-if="errorMessage"
				class="flex bg-black/[.05] justify-center w-full px-3 py-2 border border-red-500/50 rounded-full shadow-md max-w-md mx-auto mb-2"
			>
				<div class="text-sm text-center text-red-500">
					{{ errorMessage }}
				</div>
			</div>
			<div v-if="successMessage" class="flex bg-black/[.05] justify-center w-full px-3 py-2 border border-green-500/50 rounded-full shadow-md max-w-md mx-auto mb-2">
      <div class="text-sm text-center text-green-500">
        {{ successMessage }}
      </div>
    </div>
			<div
				v-if="selectedItem"
				class="flex items-center justify-between gap-x-6"
			>
				<NuxtLink to="/admin">Cancel</NuxtLink>
				<button
					@click.prevent="addToList"
					class="rounded-md bg-[#009cd9] px-12 py-2.5 text-sm font-semibold transition text-gray-100 shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white capitalize"
					:class="[isSearching ? 'pointer-events-none opacity-50' : '']"
				>
					{{ addBtnTxt }}
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		middleware: ["auth"],
		layout: "admin",
	});

	const errorMessage = ref("");
	const successMessage = ref("");
	const searchResults = ref([]);
	const isSearching = ref(false);

	const publishStatus = ref(false);

	const searchErrorMsg = ref("");
	const modalSeasonNumber = ref(0);

	const selectedItem = ref();
	const itemTags = ref([]);
	const tagSuggestions = ["mindfuck"];
	const itemComment = ref("");

	const addBtnTxt = ref("add to list");

	const addTags = (tags: never[]) => {
		itemTags.value = tags || [];
		// console.log("tags", tags);
	};
	// @ts-ignore
	const doSearch = async (data) => {
		isSearching.value = true;
		publishStatus.value = false;
		// console.log("query", data);
		modalSeasonNumber.value = 0;
		try {
			let results = await search(data.query, data.media_type);
			// queryString.value = val;
			// console.log("results", results);

			if (results && results.results) {
				if (results.results.length > 0) {
					searchResults.value = results.results;
				} else {
					searchErrorMsg.value = "No results found";

					setTimeout(() => {
						searchErrorMsg.value = "";
					}, 4000);
				}

				isSearching.value = false;
			} else {
				isSearching.value = false;
				// console.log("no results", results);
			}
		} catch (error) {
			console.log("doSearch-error", error);
		}
	};

	// @ts-ignore
	const clickHandler = async (event) => {
		searchResults.value = [];
		// console.log(event);
		let res = await getFormattedMovieDetails(event.id);
		let genres = getGenreText(res.genres);
		// console.log("res", res);
		res.genres = genres || [];
		selectedItem.value = res;
	};

	const addToList = async () => {
		addBtnTxt.value = "adding...";
		const slug = createSlug(
			selectedItem.value.title,
			selectedItem.value.release_date.split("-")[0]
		);
		const data = {
			created_at: Date.now(),
			comment: itemComment.value,
			tags: itemTags.value,
			slug: slug,
			...selectedItem.value,
		};

		let docExists = await checkIfDocExists("media", selectedItem.value.imdb_id);

		// console.log("exists", docExists);

		if (!docExists) {
			let result = await addDocWithId(
				"media",
				data,
				selectedItem.value.imdb_id
			);
			// console.log("result", result);
			selectedItem.value = ""
			successMessage.value = "Successfully added.";

			setTimeout(() => {
				successMessage.value = "";
			}, 5000);
		} else {
			console.log("no");
			errorMessage.value = "Duplicate! Item already added.";

			setTimeout(() => {
				errorMessage.value = "";
			}, 5000);
		}

		addBtnTxt.value = "add to list";
	};
</script>
