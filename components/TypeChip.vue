<template>
	<button
		@click="emitTag(title)"
		class="inline-flex px-3 py-1 text-xs transition rounded-full text-stone-300 shrink-0 bg-stone-700 hover:bg-stone-300 hover:text-stone-600"
	>
		<span class="text-xs shadow-lg">{{ title }}</span>
	</button>
</template>

<script setup>
	const props = defineProps(["title"]);
	const emit = defineEmits();

	const emitTag = (tag) => {
		emit("clicked", tag);
	};
</script>
