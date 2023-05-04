<template>
	<div class="p-4">
		<header
			class="flex sm:items-end w-full flex-col sm:flex-row justify-between"
		>
			<div class="sm:pr-6 pb-6 sm:pb-0">
				<h1 class="block text-2xl font-bold text-gray-800 sm:text-3xl">
					Posts
				</h1>
			</div>

			<div class="sm:inline-flex gap-x-2 shrink-0">
				<NuxtLink
					to="/admin/posts/compose"
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
					<span class="pl-2">Add New Post</span></NuxtLink
				>
			</div>
		</header>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		layout: "admin",
	});
</script>
