<template>
	<!-- <body class="bg-gray-50 dark:bg-slate-900"> -->
	<div class="p-6 lg:h-screen h-[calc(100vh-54px)] flex flex-col">
		<div v-if="items">
			<header
				class="flex flex-col justify-between w-full sm:items-end sm:flex-row"
			>
				<div class="pb-6 sm:pr-6 sm:pb-0">
					<h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">
						Media {{ items.length }}
					</h1>
				</div>

				<div class="sm:inline-flex gap-x-2 shrink-0">
					<NuxtLink
						to="/admin/add"
						class="flex items-center justify-center w-full px-12 py-3 text-center text-white rounded-lg bg-cyan-600 sm:w-auto shrink-0"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						<span class="pl-2">Add New Media</span></NuxtLink
					>
				</div>
			</header>

			<!-- Header -->
			<div class="grid gap-3 py-4 md:flex md:justify-between md:items-center">
				<div class="relative w-full">
					<label class="sr-only">Search</label>
					<input
						@keyup="searchPosts"
						type="text"
						class="w-full p-3 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
						placeholder="Search media"
						v-model="searchTerm"
					/>
					<div
						class="absolute inset-y-0 flex items-center pl-4 pointer-events-none right-7"
					>
						<svg
							class="h-3.5 w-3.5 text-gray-400"
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
						>
							<path
								d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
							/>
						</svg>
					</div>
				</div>
			</div>
			<!-- End Header -->
		</div>

		<div
			v-if="items"
			class="grid grid-cols-3 gap-3 overflow-y-scroll lg:grid-cols-4"
		>
			<div v-for="item in items">
				<NuxtLink v-if="item" :to="'/admin/' + item.media_type + '/' + item.slug">
				<AppCardImg :item="item" />
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		middleware: ["auth_admin"],
		layout: "admin",
	});

	useHead({
		title: "Admin Home - Watchlistr Admin",
	});

	const firebaseItems = useFirebaseItems();

	const {
		data: items,
		pending,
		error,
	} = await useFetch<any[]>("/api/media");
	// const {
	// 	data: items,
	// 	pending,
	// 	error,
	// } = await useAsyncData<any[]>("items", () => $fetch("/api/media"));

	const searchTerm = ref("");
	const searchItems = ref([]);

	watchEffect(() => {
		// @ts-ignore
		firebaseItems.value = items.value;

		// @ts-ignore
		searchItems.value = items.value;
	});

	const searchPosts = () => {
		const searchByTitle = fuzzy(items.value, "title");
		const found = searchByTitle(searchTerm.value);
		if (searchTerm.value.length > 0) {
			searchItems.value = found;
		} else {
			// @ts-ignore
			searchItems.value = items.value;
		}
		// console.log(found)
	};

	// const refresh = () => refreshNuxtData('posts')
</script>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scroller::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.scroller {
		-ms-overflow-style: none;
		/* IE and Edge */
		scrollbar-width: none;
		/* Firefox */
	}
</style>
