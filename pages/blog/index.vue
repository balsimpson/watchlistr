<template>
	<div class="max-w-4xl mx-auto">
		<!-- Card Blog -->
		<div
			class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto border border-stone-800 shadow-lg rounded-lg bg-gradient-to-b from-zinc-600/[.15] via-transparent bg-black"
		>
			<!-- Grid -->
			<div class="grid gap-8 sm:grid-cols-2 sm:items-center">
				<div class="sm:order-2">
					<div class="relative pt-[50%] sm:pt-[100%] rounded-lg">
						<img
							class="absolute top-0 left-0 object-cover w-full h-full rounded-lg"
							:src="posts[1].image"
							alt="Image Description"
						/>
					</div>
				</div>
				<!-- End Col -->

				<div class="sm:order-1">
					<p
						class="mb-5 inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-gray-600 text-gray-300"
					>
						Featured
					</p>

					<h2
						class="text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl lg:leading-tight xl:text-5xl xl:leading-tight dark:text-gray-200"
					>
						<NuxtLink
							class="transition hover:text-amber-200"
							:to="'/blog/' + posts[1].slug"
						>
							{{ posts[1].title }}
						</NuxtLink>
					</h2>

					<div class="mt-5">
						<NuxtLink
							class="inline-flex items-center gap-x-1.5 text-gray-500 decoration-2 hover:underline font-medium"
							:to="'/blog/' + posts[1].slug"
						>
							Read more
							<svg
								class="w-2.5 h-2.5"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</NuxtLink>
					</div>
				</div>
				<!-- End Col -->
			</div>
			<!-- End Grid -->
		</div>
		<!-- End Card Blog -->

		<!-- Card Blog -->
		<div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
			<!-- Title -->
			<div class="max-w-2xl mx-auto mb-10 text-center lg:mb-14">
				<h2
					class="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white"
				>
					Movie Blog
				</h2>
				<p class="mt-1 text-gray-600 dark:text-gray-400">
					Find your next movie to obsess over.
				</p>
			</div>
			<!-- End Title -->

			<!-- Grid -->
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<!-- Card -->
				<NuxtLink
					v-if="posts && posts.length"
					v-for="post in posts"
					:key="post"
					class="overflow-hidden cursor-pointer group rounded-xl"
					:to="'/blog/' + post.slug"
				>
					<div class="relative pt-[50%] sm:pt-[70%] rounded-xl overflow-hidden">
						<img
							class="absolute top-0 left-0 object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105 rounded-xl"
							:src="post.image"
							alt="Image Description"
						/>
						<span
							class="absolute top-0 right-0 rounded-tr-xl rounded-bl-xl text-xs font-medium bg-gray-800 text-white py-1.5 px-3 dark:bg-gray-900"
						>
							Sponsored
						</span>
					</div>

					<div class="mt-7">
						<h3
							class="text-xl font-semibold text-gray-300 group-hover:text-amber-500"
						>
							{{ post.title }}
						</h3>
						<p class="mt-3 text-gray-400">
							{{ post.description }}
						</p>
						<p
							class="mt-5 inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 group-hover:underline font-medium"
						>
							Read more
							<svg
								class="w-2.5 h-2.5"
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
							>
								<path
									d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</p>
					</div>
				</NuxtLink>
				<!-- End Card -->
			</div>
			<!-- End Grid -->
		</div>
		<!-- End Card Blog -->
	</div>
</template>

<script setup>
	const {
		data: posts,
		pending,
		error,
	} = await useAsyncData("blog", () => $fetch("/api/blog"));
</script>
