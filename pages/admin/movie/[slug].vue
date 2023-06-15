<template>
	<div v-if="post" class="relative flex flex-col h-full p-3">
		<div class="flex px-4 pb-12">
			<img
				:src="getImageURL(post.poster_path)"
				alt=""
				class="rounded-lg w-36"
			/>

			<div class="ml-3">
				<div class="text-2xl font-bold">{{ post.title }}</div>
				<div>{{ post.genres.join(", ") }}</div>
			</div>
		</div>

		<div class="flex-grow px-4 overflow-y-scroll">
			<!-- add comment -->
			<div class="max-w-2xl">
				<textarea
					v-model="comment"
					tabindex="0"
					rows="3"
					class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-[#009cd9] focus:border-[#009cd9]"
					:class="[error.title ? 'ring-red-500 ring-1' : '']"
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
				<div v-if="postComments && postComments.length" class="py-10 space-y-3">
					<h2 class="text-2xl font-bold">
						Comments
						<span
							class="px-2 py-1 ml-3 text-sm border border-gray-600 rounded"
							>{{ postComments.length }}</span
						>
					</h2>
					<!-- Card -->
					<div
						v-for="item in postComments"
						:key="item"
						class="relative flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl"
					>
						<div class="flex-auto p-4 pr-8 md:p-6">
							<p class="text-base text-gray-800 md:text-xl">
								<em>
									{{ item.comment }}
								</em>
							</p>
							<h3 class="mt-2 text-sm font-semibold text-gray-800 sm:text-base">
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
					<!-- End Card -->
				</div>
			</div>
		</div>

		<div class="shrink-0">
			<TagInput @updated="addTags" :suggestions="[]" class="py-2 border-t" />
			<div class="flex items-center justify-between max-w-2xl bg-white">
				<div class="space-x-2">
					<NuxtLink
						to="/admin"
						class="px-4 py-1 border rounded border-stone-400"
						>Cancel</NuxtLink
					>
					<button
						@click.prevent="deleteDoc(post.imd_id)"
						class="px-4 py-1 text-red-500 border border-red-500 rounded"
					>
						Delete
					</button>
				</div>
				<div class="flex space-x-6">
					<button
						@click.prevent="updateDoc()"
						class="inline-flex px-4 py-1 font-bold tracking-wide text-teal-800 transition bg-teal-500 border-2 border-teal-500 rounded cursor-pointer hover:bg-white hover:text-teal-500"
					>
						<span
							class="ml-3"
							:class="[
								publishBtnText == 'Updating...' ? 'pointer-events-none' : '',
							]"
							>{{ publishBtnText }}</span
						>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	// import { useToast } from "vue-toastification";
	definePageMeta({
		middleware: ["auth_admin"],
		layout: "admin",
	});

	
	
	const route = useRoute();
	// const toast = useToast();

	const comment = ref("");
	const author = ref("");

	const { data: post, pending } = await useAsyncData("post", () =>
		$fetch("/api/media?slug=" + route.params.slug)
	);

	useHead({
		title: post.value.title + " - Watchlistr Admin",
	});

	const error = reactive({
		title: "",
		post: "",
	});

	// const ogPost = computed(() => JSON.parse(post.value));
	const postTags = ref([]);
	const postComments = ref([]);

	const publishBtnText = ref("Update");

	const addComment = () => {

		console.log(postComments.value);
		postComments.value.unshift({
			comment: comment.value,
			author: author.value,
		});

		comment.value = "";
		author.value = "";
	};

	const deleteComment = (val) => {
		postComments.value = postComments.value.filter((item) => item.comment !== val);
	};

	const updateDoc = async () => {
		// console.log("media", post.value.imdb_id, comments.value);
		let res = await updateDocInFirestore("media", post.value.imdb_id, {
			comments: postComments.value,
		});
		console.log(res);
	};

	const deleteDoc = async (id) => {
		let res = await deleteDocFromFirestore("media", id);
		console.log(res);
	};

	const addTags = (tags) => {
		postTags.value = tags || [];
		// console.log("tags", tags);
	};

	onMounted(() => {
		// console.log(route.params, post.value);
		postComments.value = post.value.comments || [];
		// @ts-ignore
		postTags.value = post.value.tags || [];
	});
</script>

<style>
	#myTextarea {
		overflow: hidden;
	}
</style>
