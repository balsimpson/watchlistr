<template>
	<div class="relative">
		<div class="flex items-center">
			<input
				@keypress.enter="search(0)"
				v-model="queryInput"
				type="text"
				autocomplete="true"
				class="w-full px-3 py-3 placeholder-gray-500 transition border font-black-bold text-zinc-500 border-zinc-300 bg-zinc-50 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:bg-zinc-600 dark:border-zinc-500"
				:class="[searchResults.length ? 'rounded-t' : 'rounded']"
				:placeholder="placeholder"
			/>

			<!-- btn to clear results -->
			<button
				@click="clearResults"
				class="absolute inset-y-0 px-4 text-gray-500 right-8 dark:hover:text-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:text-gray-500"
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
					class="flex items-center h-full px-2 transition cursor-pointer text-zinc-500 hover:text-brand-500 dark:hover:text-zinc-200"
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
			class="absolute top-[52px] z-10 w-full overflow-y-scroll bg-white dark:bg-zinc-600 border dark:border-zinc-500 border-zinc-500 divide-zinc-500 divide-y dark:divide-zinc-500 rounded-b max-h-64 snap-y"
		>
			<div
				@click="selectOption(result)"
				v-for="result in searchResults"
				class="px-2 py-1 transition cursor-pointer hover:bg-zinc-800 snap-start"
			>
				<div class="flex p-3">
					<div v-if="result.poster_path" class="w-12 h-12 mr-3">
						<img
							:src="getImageURL(result.poster_path, 'small')"
							alt=""
							class="object-cover w-full h-full rounded"
						/>
					</div>
					<div class="leading-3 text-zinc-500 dark:text-zinc-300">
						<div class="text-xl font-bold">
							{{ result.title || result.name }}
							<span
								class="font-light"
								v-if="result.first_air_date || result.release_date"
							>
								{{ getYear(result.first_air_date || result.release_date) }}
							</span>
						</div>
						<div class="flex items-center">
							<span
								v-if="result.original_language"
								class="mr-2 text-sm italic text-zinc-500"
							>
								{{ getLanguage(result.original_language) }}
							</span>
							<span
								v-if="result.genre_ids.length"
								class="px-2 py-1 text-xs font-medium tracking-wide uppercase rounded text-zinc-500 bg-zinc-300 dark:bg-zinc-700"
							>
								{{ getGenre(result.genre_ids)[0].text }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		getImageURL,
		getYear,
		getLanguage,
		getGenre,
	} from "~/composables/useTmdbApiRefactored";

	const props = defineProps(["placeholder", "searchResults", "isSearching"]);
	const emit = defineEmits(["clear", "search", "selected"]);

	const selected = ref(null);
	const queryInput = ref("");
	const media_type = ref("movie");
	const delay = ref(0);

	const search = () => {
		if (queryInput.value) {
			emit("clear");
			// console.log("searching", queryInput.value);
			emit("search", {
				query: queryInput.value,
				media_type: media_type.value,
			});
		}
	};

	const selectOption = (option) => {
		selected.value = option;

		// console.log('selected', selected.value)
		emit("selected", selected.value);
		selected.value = null;
		queryInput.value = "";
	};

	const clearResults = () => {
		selected.value = null;
		queryInput.value = "";
		emit("clear");
	};
</script>
