<template>
	<div class="flex flex-col h-full max-w-2xl relative p-3 text-stone-600">
		<textarea
			@input="adjustTextareaHeight"
			ref="textarea"
			tabindex="0"
			rows="1"
			class="w-full h-auto py-4 text-2xl font-bold bg-transparent shrink-0 sm:text-4xl focus:outline-none placeholder-stone-400"
			:class="[error.title ? 'ring-red-500 ring-1':'']"
			placeholder="Your post title..."
			v-model="postTitle"
		></textarea>
		
		<div class="flex-grow w-full mt-2 h-screen overflow-y-scroll" >
			<Tiptap @update="docUpdated"/>
		</div>

		<div class="shrink-0">
			<TagInput @updated="addTags" :suggestions="[]" class="py-2 border-t" />
			<div class="flex items-center justify-between max-w-2xl bg-white">
				<NuxtLink to="/admin/posts" class="px-4 py-1 border rounded">Cancel</NuxtLink>
				<div class="flex space-x-6">
					<button>Save draft</button>
					<button
						@click.prevent="saveDoc('published')"
						class="inline-flex px-4 py-1 font-bold tracking-wide text-teal-800 transition bg-cyan-500 border-2 border-cyan-500 rounded cursor-pointer hover:bg-white hover:text-cyan-500"
					>
						<span
							class="ml-3"
							:class="[
								publishBtnText == 'Publishing...' ? 'pointer-events-none' : '',
							]"
							>{{ publishBtnText }}</span
						>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	// import { useToast } from "vue-toastification";
	definePageMeta({
		middleware: ["auth"],
		layout: "admin",
		// or middleware: 'auth'
	});

	// const toast = useToast();
	const postTitle = ref();
	const postTags = ref([]);
	const publish_date = ref(
		new Date().getFullYear() +
			"-" +
			("0" + (new Date().getMonth() + 1)).slice(-2) +
			"-" +
			("0" + new Date().getDate()).slice(-2)
	);
	const editorPost = ref({});
	const publishBtnText = ref("Publish");
	const draftBtnText = ref("Save Draft");

	const error = reactive({
		title: "",
		post: "",
	});

	const textarea = ref();

	const userCookie = useCookie("userCookie");

	const docUpdated = (doc: {}) => {
		editorPost.value = doc;
	};

	const saveDoc = async (status: string) => {
		if (validateFields()) {
			if (status == "draft") {
				draftBtnText.value = "saving...";
			} else {
				publishBtnText.value = "Publishing...";
			}
			// @ts-ignore
			const { description, image } = getPostDetails(editorPost.value);
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
				published_at: publish_date.value || Date.now(),
			};

			console.log(data);
			let res = await addDocToFirestore("posts", data);
			console.log(res);

			// // @ts-ignore
			// if (res.type == "document") {
			// 	toast.success(data.title + " was saved!");
			// } else {
			// 	toast.error("Post failed to save! - " + res);
			// }
			publishBtnText.value = "Publish";
			draftBtnText.value = "Save draft";
		}
	};

	const addTags = (tags: never[]) => {
		postTags.value = tags || [];
		// console.log("tags", tags);
	};

	function adjustTextareaHeight() {
		if (postTitle.value.length > 0) {
			textarea.value.style.height = "auto";
			textarea.value.style.height = textarea.value.scrollHeight + "px";
		} else {
			textarea.value.style.height = 22 + "px";
		}
	}

	function validateFields() {
		let isValid = true;

		if (!postTitle.value) {
			error.title = "Please give your post a title";
			isValid = false;
		} else {
			error.title = "";
		}

		if (!editorPost.value) {
			error.post = "Article cannot be empty";
			isValid = false;
		} else {
			error.post = "";
		}

		setTimeout(() => {
			error.title = "";
			error.post = "";
		}, 5000);

		return isValid;
	}
</script>
