<template>
	<div class="max-w-2xl p-4 h-full flex flex-col mx-auto">
		<div class="grow overflow-y-scroll">
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Est quia iure
				dolores eius aperiam. Reiciendis, aut consequatur maiores alias dolorem
				at eaque. Tempora doloremque iure quam. Explicabo odit aspernatur
				mollitia.
			</p>

			<SearchWithDropdown
				@keyup="publishStatus = false"
				class="z-60"
				@search="doSearch($event)"
				@selected="clickHandler($event)"
				@clear="searchResults = []"
				placeholder="try 'The Office'"
				:searchResults="searchResults"
				:isSearching="isSearching"
			>
			</SearchWithDropdown>

			<!-- result -->

			<!-- <pre>{{ selectedItem }}</pre> -->
			<div
				v-if="selectedItem"
				class="flex flex-wrap items-center max-w-5xl mx-auto sm:mt-12 mt-3"
			>
				<div class="grid gap-12 sm:grid-cols-2 text-gray-700">
					<div class="relative">
						<img
							class="object-cover object-center w-full sm:h-auto h-96 mx-auto rounded-lg"
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
							class="mt-2 mb-4 text-sm leading-6 text-center text-gray-700 sm:text-left pt-6"
						>
							{{ selectedItem.overview }}
						</p>

						<TagInput
							@updated="addTags"
							:suggestions="tagSuggestions"
							class="py-2 border-t"
						/>

						<textarea
							class="border rounded-md w-full p-3"
							rows="5"
							v-model="itemComment"
							placeholder="Your comments"
						></textarea>

						<div
							class="mt-10 flex justify-center items-center gap-x-6 sm:justify-start"
						>
							<button
								@click.prevent="addToList"
								class="rounded-md bg-[#009cd9] px-12 py-2.5 text-sm font-semibold transition text-gray-100 shadow-sm hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
							>
								Add to list
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div>hello</div>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		middleware: ["auth"],
		layout: "admin",
	});

	const searchTerm = ref("");

	const newList = ref([]);
	const searchResults = ref([]);
	const queryString = ref("");
	const isSearching = ref(false);

	const publishStatus = ref(false);
	const publishedLink = ref("");

	const searchErrorMsg = ref("");
	const modalSeasonNumber = ref(0);

	const selectedItem = ref();
	const itemTags = ref([]);
	const tagSuggestions = ["mindfuck"];
	const itemComment = ref("");

	const addTags = (tags: never[]) => {
		itemTags.value = tags || [];
		// console.log("tags", tags);
	};
	// @ts-ignore
	const doSearch = async (data) => {
		isSearching.value = true;
		publishStatus.value = false;
		console.log("query", data);
		modalSeasonNumber.value = 0;
		try {
			let results = await search(data.query, data.media_type);
			// queryString.value = val;
			console.log("results", results);

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
				console.log("no results", results);
			}
		} catch (error) {
			console.log("doSearch-error", error);
		}
	};

	// @ts-ignore
	const clickHandler = async (event) => {
		searchResults.value = [];
		console.log(event);
		let res = await getFormattedMovieDetails(event.id);
		let genres = getGenreText(res.genres);
		console.log("res", res);
		res.genres = genres || [];
		selectedItem.value = res;
	};

	const addToList = async () => {
		const data = {
			created_at: Date.now(),
			item: selectedItem.value,
			comment: itemComment.value,
			tags: itemTags.value,
		};

		console.log(selectedItem.value.imdb_id);

		let docExists = await checkIfDocExists(selectedItem.value.imdb_id);

		// console.log("exists", res)

		if (!docExists) {
			let result = await addDocWithId("items", data, selectedItem.value.imdb_id);
			console.log("result", result)
		} else {
			console.log("no");
		}
	};
</script>
