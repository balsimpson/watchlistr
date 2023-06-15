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

						<!-- add comments -->
						<textarea
							v-model="comment"
							tabindex="0"
							rows="2"
							class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-[#009cd9] focus:border-[#009cd9]"
							placeholder="Enter quote..."
						></textarea>

						<input
							v-model="author"
							type="text"
							required="true"
							placeholder="Author"
							class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-[#009cd9] focus:border-[#009cd9]"
						/>

						<button
							@click.prevent="addComment('published')"
							class="inline-flex px-4 py-1 mt-3 tracking-wide text-teal-600 transition border-2 border-teal-500 rounded cursor-pointer hover:bg-teal-600 hover:text-white"
						>
							<span
								class="ml-3"
								:class="[
									publishBtnText == 'Updating...' ? 'pointer-events-none' : '',
								]"
								>Add comment</span
							>
						</button>

						<!-- comments -->
						<div
							v-for="item in postComments"
							:key="item"
							class="relative flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl"
						>
							<div class="flex-auto p-4 md:p-6">
								<p class="text-base text-gray-800 md:text-xl">
									<em>
										{{ item.comment }}
									</em>
								</p>
								<h3
									class="mt-2 text-sm font-semibold text-gray-800 sm:text-base"
								>
									{{ item.author }}
								</h3>
							</div>

							<button @click.prevent="deleteComment(item.comment)">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="absolute w-5 h-5 top-2 right-2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
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
			<div
				v-if="successMessage"
				class="flex bg-black/[.05] justify-center w-full px-3 py-2 border border-green-500/50 rounded-full shadow-md max-w-md mx-auto mb-2"
			>
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

<script setup>
	definePageMeta({
		middleware: ["auth"],
		layout: "admin",
	});

	useHead({
		title: "Add Movie - Watchlistr Admin",
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

	const postComments = ref([]);
	const comment = ref("");
	const author = ref("");

	const publishBtnText = ref("Update");

	const addComment = () => {
		postComments.value.unshift({
			comment: comment.value,
			author: author.value,
		});

		comment.value = "";
		author.value = "";
	};

	const deleteComment = (val) => {
		postComments.value = postComments.value.filter(
			(item) => item.comment !== val
		);
	};

	const addBtnTxt = ref("add to list");

	const addTags = (tags) => {
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
			comments: postComments.value,
			tags: itemTags.value,
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
			// console.log("result", result);
			selectedItem.value = "";
			successMessage.value = "Successfully added.";

			setTimeout(() => {
				successMessage.value = "";
			}, 5000);
		}

		addBtnTxt.value = "add to list";
	};
</script>
