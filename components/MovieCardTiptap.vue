<template>
	<node-view-wrapper class="flex items-center w-full gap-x-6">
		<img :src="node.attrs.src" :alt="node.attrs.title" class="w-1/4 h-full" />

		<div class="w-3/4 shrink-0">
			{{ node.attrs.title }}
			<!-- <node-view-content contenteditable="true">
				{{ node.attrs.description }}
			</node-view-content> -->
		</div>
	</node-view-wrapper>
</template>

<script setup lang="ts">
	import { NodeViewWrapper, NodeViewContent } from "@tiptap/vue-3";

	const props = defineProps({
		node: {
			type: Object,
			required: true,
		},
		updateAttributes: {
			type: Function,
			required: true,
		},
	});
</script>

<style>
	.custom-class {
		display: flex;
		width: 100%;
		align-items: center;
	}
	/* .vue-component {
		background: #faf594;
		border: 3px solid #0d0d0d;
		border-radius: 0.5rem;
		margin: 1rem 0;
		position: relative;
	}

	.label {
		margin-left: 1rem;
		background-color: #0d0d0d;
		font-size: 0.6rem;
		letter-spacing: 1px;
		font-weight: bold;
		text-transform: uppercase;
		color: #fff;
		position: absolute;
		top: 0;
		padding: 0.25rem 0.75rem;
		border-radius: 0 0 0.5rem 0.5rem;
	} */

	/* .content {
		margin-top: 1.5rem;
		padding: 1rem;
	} */
</style>
