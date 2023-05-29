<template>
	<div class="p-4 lg:h-screen h-[calc(100vh-54px)]">
		<header
			class="flex flex-col justify-between w-full sm:items-end sm:flex-row"
		>
			<div class="pb-6 sm:pr-6 sm:pb-0">
				<h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">
					Posts
				</h1>
			</div>

			<div class="sm:inline-flex gap-x-2 shrink-0">
				<NuxtLink
					to="/admin/posts/compose"
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
					<span class="pl-2">Add New Post</span>
				</NuxtLink>
			</div>
		</header>

		<div class="h-full py-6 overflow-y-scroll lg:py-14">
			<div
				v-if="posts && posts.length"
				class="h-full my-3 space-y-3 overflow-y-scroll scroller snap-mandatory snap-y"
			>
				<AppCardPost
					v-for="post in posts"
					:key="post"
					:post="post"
					showEditBtn="true"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		layout: "admin",
	});

	const {
		data: posts,
		pending,
		error,
	} = await useAsyncData("blog", () => $fetch("/api/blog"));
</script>
