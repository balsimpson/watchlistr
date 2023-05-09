<template>
	<div>
		<AppImageCard :item="posts[0]" class="py-4" />
		<!-- Grid -->
		<div v-if="posts" class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Card -->
			<AppCardImg v-for="post in posts" :item="post" />
			<!-- End Card -->
		</div>
		<!-- Card Blog -->
		<div class="max-w-[85rem] py-10 lg:py-14 mx-auto">
			<div
				v-if="posts && posts.length"
				class="h-full my-3 space-y-3 overflow-y-scroll scroller snap-mandatory snap-y"
			>
				<AppCardPost v-for="post in posts" :key="post" :post="post" />
			</div>
		</div>
	</div>
</template>

<script setup>
	const {
		data: posts,
		pending,
		error,
	} = await useAsyncData("posts", () => $fetch("/api/post"));

	const showToast = (msg) => {
		toast(msg, {
			timeout: 50000,
			toastClassName: "bg-purple-600",
			bodyClassName: ["font-semibold"],
		});
	};
</script>
