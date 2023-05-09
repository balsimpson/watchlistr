<template>
	<div>
		<!-- <AppImageCard :item="posts[0]" class="py-4" /> -->
		{{ posts }}
		<!-- Card Blog -->
		<div class="max-w-[85rem] py-10 lg:py-14 mx-auto"> -->
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
	} = await useAsyncData("blog", () => $fetch("/api/blog"));

	const showToast = (msg) => {
		toast(msg, {
			timeout: 50000,
			toastClassName: "bg-purple-600",
			bodyClassName: ["font-semibold"],
		});
	};
</script>
