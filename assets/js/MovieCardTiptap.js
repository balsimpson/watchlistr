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
			description: {
				default: ""
			}
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
		
		return [
			"div",
			mergeAttributes({
				class: "flex w-full items-center gap-x-6 border-t border-stone-600 border-dotted h-64",
			}),
			// HTMLAttributes.title,
			
			[
				"div",
				mergeAttributes({
					class: "w-1/4",
				}),
				[
					"img",
					mergeAttributes({
						src: HTMLAttributes.src,
						class: "rounded-lg shadow-lg w-36",
					}),
				],
			],
			[
				"div",
				mergeAttributes({
					class: "w-3/4",
				}),
				// [
				// 	"div",
				// 	mergeAttributes({
				// 		class: "text-2xl font-bold",
				// 	}),
				// 	HTMLAttributes.title,
				// ],
				[
					"a",
					mergeAttributes({
						class: "font-semibold text-2xl font-bold text-amber-300",
						href: "/movie/" + HTMLAttributes.slug,
						target: "_blank"
					}),
					HTMLAttributes.title,
				],
				[
					"div",
					mergeAttributes({
						class: "text-xs italic",
					}),
					HTMLAttributes.release_date.split("-")[0] + ", " + HTMLAttributes.runtime + " min",
				],
				[
					"div",
					mergeAttributes({
						class: "text-sm font-semibold",
					}),
					HTMLAttributes.genres.join(", "),
				],
				// [
				// 	"p",
				// 	mergeAttributes({
				// 		class: "text-sm",
				// 	}),
				// 	HTMLAttributes.description,
				// ],
				[
					"a",
					mergeAttributes({
						class: "text-sm font-semibold text-stone-300",
						href: "https://www.imdb.com/title/" + HTMLAttributes.imdb_id,
						target: "_blank"
					}),
					"on IMDb",
				],
				[
					"button",
					mergeAttributes({
						class: "text-sm font-semibold text-stone-300 block",
						onclick: `console.log(${HTMLAttributes.imdb_id})`
					}),
					"Add to Watchlist",
				],
			],
		];
	},

	addNodeView() {
		return VueNodeViewRenderer(Component);
	},
});
