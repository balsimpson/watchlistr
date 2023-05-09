<template>
	<div
		class="group flex flex-col sm:flex-row h-auto bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden"
	>
		<!-- {{ post }} -->
		<div class="bg-blue-600 sm:w-1/5 shrink-0">
			<img
				:src="post.image"
				alt=""
				class="sm:h-full h-36 w-full object-cover"
			/>
		</div>
		<div class="flex flex-col">
			<div class="flex-grow p-4 md:p-6">
				<span class="block mb-1 text-xs font-semibold uppercase text-blue-600">
					{{ new Date(post.published_at).toDateString() }}
				</span>
				<NuxtLink
					:to="{
						name: 'blog-slug',
						params: {
							slug: post.slug,
						},
					}"
				>
					<h3 class="text-xl font-semibold text-gray-800">
						{{ post.title }}
					</h3>
				</NuxtLink>
				<p class="mt-3 text-gray-500 line-clamp-4">
					{{ post.description }}
				</p>
			</div>
			<NuxtLink
				v-if="showEditBtn"
				:to="{
					name: 'admin-edit-slug',
					params: {
						slug: post.slug,
					},
				}"
			>
				Edit
			</NuxtLink>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const props = defineProps(["post", "showEditBtn"]);
</script>
