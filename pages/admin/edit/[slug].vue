<template>
	<div v-if="post" class="relative flex flex-col h-full max-w-2xl p-3">
		<!-- <pre>{{ post }}</pre> -->
		<textarea
			@input="adjustTextareaHeight"
			ref="textarea"
			tabindex="0"
			rows="1"
			class="w-full h-auto py-4 text-2xl font-bold bg-transparent shrink-0 sm:text-4xl focus:outline-none"
			:class="[error.title ? 'ring-red-500 ring-1' : '']"
			placeholder="Your post title..."
			v-model="postTitle"
		></textarea>
		<!-- <div class="flex items-center pt-4">
			<div class="w-48 text-sm font-bold text-gray-700" for="date">
				Publish date
			</div>
			<input
				class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
				id="date"
				type="date"
				placeholder="Choose the date of the tour"
				v-model="post.published_at"
			/>
		</div> -->
		<div class="flex-grow w-full h-screen mt-2 overflow-y-scroll">
			<TiptapAddMovieTest @update="docUpdated" :content="post?.content" />
		</div>

		<div class="shrink-0">
			<TagInput @updated="addTags" :suggestions="[]" class="py-2 border-t" />
			<div class="flex items-center justify-between max-w-2xl bg-white">
				<div class="space-x-2">
					<NuxtLink to="/admin" class="px-4 py-1 border rounded border-stone-400"
						>Cancel</NuxtLink
					>
					<button @click.prevent="deleteDoc(post.id)" class="px-4 py-1 text-red-500 border border-red-500 rounded">
						Delete
					</button>
				</div>
				<div class="flex space-x-6">
					<button>Save draft</button>
					<button
						@click.prevent="saveDoc('published')"
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
		middleware: ["auth"],
		layout: "admin",
	});
	const route = useRoute();
	// const toast = useToast();

	const { data: post, pending } = await useAsyncData("post", () =>
		$fetch("/api/post?slug=" + route.params.slug)
	);

	const error = reactive({
		title: "",
		post: "",
	});
	// @ts-ignore
	const ogPost = computed(() => post.value);
	// const ogPost = computed(() => JSON.parse(post.value));
	const postTags = ref([]);
	const editorPost = ref({});
	const publishBtnText = ref("Update");
	const draftBtnText = ref("Save Draft");

	const userCookie = useCookie("userCookie");

	// @ts-ignore
	const postTitle = ref(post.value.title);

	const docUpdated = (doc) => {
		editorPost.value = doc;
	};

	const saveDoc = async (status) => {
		// @ts-ignore
		const { description, image } = getPostDetails(editorPost.value);

		if (status == "draft") {
			draftBtnText.value = "saving...";
		} else {
			publishBtnText.value = "Updating...";
		}

		if (postTitle.value) {
			const slug = createSlug(postTitle.value);
			const data = {
				title: postTitle.value,
				author: {
					// @ts-ignore
					name: userCookie.value.providerData[0].displayName,
					// @ts-ignore
					email: userCookie.value.providerData[0].email,
					// @ts-ignore
					photo: userCookie.value.providerData[0].photoURL,
					// @ts-ignore
					uid: userCookie.value.uid,
				},
				description,
				image,
				slug,
				status,
				content: editorPost.value,
				tags: postTags.value || [],
				// published_at: Date.now(),
				last_updated: Date.now(),
			};

			// @ts-ignore
			let res = await updateDocInFirestore("posts", ogPost.value.id, data);
			console.log(res);

			// @ts-ignore
			// if (!res) {
			// 	toast.success(data.title + " was updated!");
			// } else {
			// 	toast.error("Post failed to save! - " + res);
			// }
			publishBtnText.value = "Update";
			draftBtnText.value = "Save draft";
		} else {
			console.log("else");
		}
	};

	const deleteDoc = async (id) => {
		let res = await deleteDocFromFirestore("posts", id)
		console.log(res)
	}

	const addTags = (tags) => {
		postTags.value = tags || [];
		// console.log("tags", tags);
	};

	onMounted(() => {
		console.log(route.params, post.value);
		// @ts-ignore
		editorPost.value = post.value.content;
		// @ts-ignore
		postTitle.value = post.value.title;
		// @ts-ignore
		postTags.value = post.value.tags || [];
		adjustTextareaHeight();
	});

	const textarea = ref();
	function adjustTextareaHeight() {
		if (postTitle.value.length > 0) {
			textarea.value.style.height = "auto";
			textarea.value.style.height = textarea.value.scrollHeight + "px";
		} else {
			textarea.value.style.height = 22 + "px";
		}
	}
</script>

<style>
	#myTextarea {
		overflow: hidden;
	}
</style>
