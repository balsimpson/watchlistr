import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

import Component from "/components/MovieCardTiptap.vue";

export default Node.create({
	name: "movieCardTiptap",

	group: "block",

	atom: true,

	addAttributes() {
		return {
			title: {
				default: "",
			},
			src: {
				default: "",
			},
			genres: {
				default: [],
			},
			spoken_languages: {
				default: [],
			},
			imdb_id: {
				default: "",
			},
			release_date: {
				default: "",
			},
			runtime: {
				default: "",
			},
			slug: {
				default: "",
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: "movie-card-tiptap",
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		// return [
		// 	"div",
		// 	["img", mergeAttributes(HTMLAttributes, { src: HTMLAttributes.src })],
		// 	[
		// 		"div",
		// 		mergeAttributes(HTMLAttributes, {
		// 			"value": JSON.stringify(HTMLAttributes),
		// 		}),
		// 	],
		// ];
		// return ['div', ['img', mergeAttributes(HTMLAttributes, { src: HTMLAttributes.src })], ['div', mergeAttributes(HTMLAttributes, { src: HTMLAttributes.src })]]
		return [
			"div",
			mergeAttributes({
				class: "flex w-full items-center gap-x-6 pt-6  border-t border-stone-600 border-dashed",
			}),
			// HTMLAttributes.title,
			
			[
				"div",
				mergeAttributes({
					class: "",
				}),
				[
					"img",
					mergeAttributes({
						src: HTMLAttributes.src,
						class: "rounded-lg shadow-lg m-1",
					}),
				],
			],
			[
				"div",
				mergeAttributes({
					class: "w-3/4",
				}),
				[
					"div",
					mergeAttributes({
						class: "text-2xl font-bold",
					}),
					HTMLAttributes.title,
				],
				[
					"div",
					mergeAttributes({
						class: "text-xs italic",
					}),
					HTMLAttributes.release_date.split("-")[0] + ", " + HTMLAttributes.runtime,
				],
				[
					"div",
					mergeAttributes({
						class: "text-sm font-semibold",
					}),
					HTMLAttributes.genres.join(", "),
				],
			],
		];
		// return ['movie-card-tiptap', mergeAttributes(HTMLAttributes)]
	},

	addNodeView() {
		return VueNodeViewRenderer(Component);
	},
});
