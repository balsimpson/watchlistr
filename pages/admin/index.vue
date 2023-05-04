<template>
	<!-- <body class="bg-gray-50 dark:bg-slate-900"> -->
	<div class="p-6 lg:h-screen h-[calc(100vh-54px)] flex flex-col">
		<div>
			<header class="flex sm:items-end w-full flex-col sm:flex-row">
				<div class="sm:pr-6 pb-6 sm:pb-0">
					<h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">
						Blog Posts
					</h1>
					<p class="mt-2 text-lg text-gray-800">
						Add new posts or edit existing ones. These will show on the blog
						page of the website.
					</p>
				</div>

				<div class="sm:inline-flex gap-x-2 shrink-0">
					<NuxtLink
						to="/admin/add"
						class="w-full px-12 py-3 text-center text-white bg-cyan-600 rounded-lg sm:w-auto shrink-0 flex items-center justify-center"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						<span class="pl-2">Add New Item</span></NuxtLink
					>
				</div>
			</header>

			<!-- Header -->
			<div class="py-4 grid gap-3 md:flex md:justify-between md:items-center">
				<div class="relative w-full">
					<label class="sr-only">Search</label>
					<input
						@keyup="searchPosts"
						type="text"
						class="w-full p-3 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
						placeholder="Search posts"
						v-model="searchTerm"
					/>
					<div
						class="absolute inset-y-0 right-7 flex items-center pl-4 pointer-events-none"
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
			<div class="inline-flex gap-x-2">
				<NuxtLink
					to="/admin/events/add"
					class="w-full px-3 py-1 text-center text-cyan-600 border-2 border-cyan-500 rounded-lg sm:w-auto shrink-0 flex items-center text-sm"
				>
					<span class="pl-2">Show Drafts</span></NuxtLink
				>
			</div>
			<!-- End Header -->
		</div>

		<div class="flex-grow overflow-y-scroll space-y-4">
			<!-- <pre>{{ posts }}</pre> -->
			<AppCardPost v-for="post in posts" :key="post" :post="post"/>
		</div>

		<div>hello</div>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		middleware: ["auth"],
		layout: "admin",
	});

	const firebaseItems = useFirebaseItems();

	const {
		data: posts,
		pending,
		error,
	} = await useAsyncData<any[]>("posts", () => $fetch("/api/post"));

	const searchTerm = ref("");
	const searchItems = ref([]);

	watchEffect(() => {
		// @ts-ignore
		firebaseItems.value = posts.value;

		// @ts-ignore
		searchItems.value = posts.value;
	});

	const searchPosts = () => {
		const searchByTitle = fuzzy(posts.value, "title");
		const found = searchByTitle(searchTerm.value);
		if (searchTerm.value.length > 0) {
			searchItems.value = found;
		} else {
			// @ts-ignore
			searchItems.value = posts.value;
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
