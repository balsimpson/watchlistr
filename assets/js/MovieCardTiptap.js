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
			overview: {
				default: "",
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
		// return ['MovieCardTiptap', mergeAttributes(HTMLAttributes)]
		return [
			"div",
			mergeAttributes({
				class:
					"flex w-full items-center gap-x-6 border-t border-stone-600 border-dotted",
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
						class: "font-semibold text-2xl font-bold text-amber-500",
						href: "/movie/" + HTMLAttributes.slug,
						target: "_blank",
					}),
					HTMLAttributes.title,
				],
				[
					"div",
					mergeAttributes({
						class: "text-xs italic",
					}),
					HTMLAttributes.release_date.split("-")[0] +
						", " +
						HTMLAttributes.runtime +
						" min",
				],
				[
					"div",
					mergeAttributes({
						class: "text-sm font-semibold",
					}),
					HTMLAttributes.genres.join(", "),
				],
				[
					"p",
					mergeAttributes({
						class: "text-sm",
					}),
					HTMLAttributes.overview,
				],
				// [
				// 	"a",
				// 	mergeAttributes({
				// 		class: "text-sm font-semibold text-stone-300",
				// 		href: "https://www.imdb.com/title/" + HTMLAttributes.imdb_id,
				// 		target: "_blank",
				// 	}),
				// 	[
				// 		"img",
				// 		mergeAttributes({
				// 			src: "/imdb_icon.png",
				// 			class: "rounded-lg shadow-lg w-12 ",
				// 		}),
				// 	],
				// ],
				[
					"button",
					mergeAttributes({
						class: "text-sm font-semibold text-stone-300 block addToWatchlist",
						id: HTMLAttributes.imdb_id,
						onclick: `addWatchlist("add", ${HTMLAttributes.imdb_id})`
					}),
					"Add to Watchlist",
				],
			],
		];
	},

	addNodeView() {
		// const dom = document.createElement("div");

		// dom.classList.add("node-view");
		// const content = document.createElement("div");

		// content.classList.add("content");
		// const button = document.createElement("button");
		// button.innerHTML = `This button has been clicked ${attrs.count} times.`;

		// content.append(button);

		// dom.append(label, content);

		// return {
		// 	dom,
		// };

		return VueNodeViewRenderer(Component);
	},

	// addCommands() {
	// 	return {
	// 		addWatchlist: () => console.log("watchlist")
	// 	}
	// }
});
