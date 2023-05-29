<template>
	<div class="flex flex-col h-full p-4">
		<TiptapMinimal class="grow bg-cyan-100" />

		<div class="z-20">some text</div>
	</div>
</template>

<script setup>
	definePageMeta({
		layout: "admin",
        middleware: "auth"
	});
</script>
