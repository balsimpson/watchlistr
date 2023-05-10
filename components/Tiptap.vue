<template>
	<!-- <editor-content :editor="editor" /> -->
	<div
		v-if="editor"
		class="flex flex-col w-full h-full rounded-none sm:rounded-lg"
	>
		<div class="relative">
			<div
				class="flex fixed justify-between bg-stone-200 border-b rounded-lg z-20 text-neutral-500 focus:outline-none"
			>
				<div
					class="flex flex-wrap items-center gap-3 p-2 sm:p-4 text-stone-600"
				>
					<!-- h1 -->
					<button
						@click.prevent="
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive('heading', { level: 1 })
								? 'is-active text-teal-600'
								: '',
						]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							class="w-6 h-6"
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="4"
								d="M6 8v32M25 8v32M6 24h19m9.226 0L39 19.017V40"
							/>
						</svg>
					</button>

					<!-- h2 -->
					<button
						@click.prevent="
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive('heading', { level: 2 })
								? 'is-active text-teal-600'
								: '',
						]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							class="w-6 h-6"
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="4"
								d="M6 8v32M24 8v32M7 24h16m9 1c0-3.167 2.667-5 5-5s5 1.833 5 5c0 5.7-10 9.933-10 15h10"
							/>
						</svg>
					</button>

					<!-- h3 -->
					<button
						@click.prevent="
							editor.chain().focus().toggleHeading({ level: 3 }).run()
						"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive('heading', { level: 3 })
								? 'is-active text-teal-600'
								: '',
						]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							class="w-6 h-6"
						>
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="4"
								d="M6 8v32M24 8v32M7 24h16m9-4h10l-7 9c4 0 7 2 7 6s-3 5-5 5c-2.381 0-4-1-5-2.1"
							/>
						</svg>
					</button>

					<!-- bold -->
					<button
						@click.prevent="editor.chain().focus().toggleBold().run()"
						class="hover:text-cyan-600"
						:class="[editor.isActive('bold') ? 'is-active text-teal-600' : '']"
					>
						<svg
							class="w-6 h-6"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.501 4.501 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.5 4.5 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8Z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- italic -->
					<button
						@click.prevent="editor.chain().focus().toggleItalic().run()"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive('italic') ? 'is-active text-teal-600' : '',
						]"
					>
						<svg
							class="w-6 h-6"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15v2Z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- quote -->
					<button
						@click.prevent="editor.chain().focus().toggleBlockquote().run()"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive('blockquote') ? 'is-active text-teal-600' : '',
						]"
					>
						<svg
							class="w-6 h-6"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- code -->
					<button
						@click.prevent="editor.chain().focus().toggleCode().run()"
						class="hover:text-cyan-600"
						:class="[editor.isActive('code') ? 'is-active text-teal-600' : '']"
					>
						<svg
							class="w-6 h-6"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="m23 12-7.071 7.071-1.414-1.414L20.172 12l-5.657-5.657 1.414-1.414zM3.828 12l5.657 5.657-1.414 1.414L1 12l7.071-7.071 1.414 1.414z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- codeblock -->
					<button
						@click.prevent="editor.chain().focus().toggleCodeBlock().run()"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive('codeBlock') ? 'is-active text-teal-600' : '',
						]"
					>
						<svg
							class="crayons-icon"
							height="24"
							viewBox="0 0 24 24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5zm15 7-3.536 3.536-1.414-1.415L16.172 12 14.05 9.879l1.414-1.415zM7.828 12l2.122 2.121-1.414 1.415L5 12l3.536-3.536L9.95 9.88z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- link -->
					<button
						@click.prevent="linkHandler('link')"
						class="cursor-pointer hover:text-teal-500"
						:class="[editor.isActive('link') ? 'is-active text-teal-500' : '']"
					>
						<svg
							class="crayons-icon"
							height="24"
							viewBox="0 0 24 24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18.364 15.536 16.95 14.12l1.414-1.414a5.001 5.001 0 0 0-3.531-8.551 5 5 0 0 0-3.54 1.48L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 1 1 9.9 9.9l-1.415 1.414zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- movie -->
					<button
						@click="
							editor
								.chain()
								.focus()
								.insertTable({ rows: 1, cols: 2})
								.run()
						"
						class="cursor-pointer hover:text-teal-500"
						:class="[editor.isActive('link') ? 'is-active text-teal-500' : '']"
					>
						<svg
							class="crayons-icon"
							height="24"
							viewBox="0 0 24 24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18.364 15.536 16.95 14.12l1.414-1.414a5.001 5.001 0 0 0-3.531-8.551 5 5 0 0 0-3.54 1.48L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 1 1 9.9 9.9l-1.415 1.414zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
								fill="currentColor"
							/>
						</svg>
					</button>

					<!-- image -->
					<label
						class="flex flex-col items-center transition-colors cursor-pointer"
						:class="[isUploadingImage ? 'animate-pulse' : '']"
					>
						<svg
							aria-hidden="true"
							focusable="false"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							:class="[
								editor.isActive('image')
									? 'is-active text-teal-600'
									: ' hover:text-teal-500 w-6 h-6',
							]"
						>
							<path
								d="M20 5H4v14l9.292-9.294a1 1 0 0 1 1.414 0L20 15.01V5zM2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
								fill="currentColor"
							/>
						</svg>
						<input
							@change="uploadImage"
							type="file"
							accept=".jpeg,.jpg,.png,image/jpeg,image/png,image/gif"
							class="sr-only"
						/>
					</label>

					<!-- align left -->
					<button
						@click.prevent="editor.chain().focus().setTextAlign('left').run()"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive({ textAlign: 'left' })
								? 'is-active text-teal-600'
								: '',
						]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-6 h-6"
						>
							<path
								fill="currentColor"
								d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"
							/>
						</svg>
					</button>

					<!-- align center -->
					<button
						@click.prevent="editor.chain().focus().setTextAlign('center').run()"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive({ textAlign: 'center' })
								? 'is-active text-teal-600'
								: '',
						]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-6 h-6"
						>
							<path
								fill="currentColor"
								d="M7 16c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zm-3 5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-8h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm3-5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zM3 4c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"
							/>
						</svg>
					</button>

					<!-- align right -->
					<button
						@click.prevent="editor.chain().focus().setTextAlign('right').run()"
						class="hover:text-cyan-600"
						:class="[
							editor.isActive({ textAlign: 'right' })
								? 'is-active text-teal-600'
								: '',
						]"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-6 h-6"
						>
							<path
								fill="currentColor"
								d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"
							/>
						</svg>
					</button>

					<!-- youtube -->
					<button
						@click.prevent="linkHandler('youtube')"
						class="relative hover:text-cyan-600"
						:class="[showAddYTLink ? 'is-active text-teal-600' : '']"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="w-6 h-6"
						>
							<path
								fill="currentColor"
								d="M508.64 148.79c0-45-33.1-81.2-74-81.2C379.24 65 322.74 64 265 64h-18c-57.6 0-114.2 1-169.6 3.6C36.6 67.6 3.5 104 3.5 149C1 184.59-.06 220.19 0 255.79q-.15 53.4 3.4 106.9c0 45 33.1 81.5 73.9 81.5c58.2 2.7 117.9 3.9 178.6 3.8q91.2.3 178.6-3.8c40.9 0 74-36.5 74-81.5c2.4-35.7 3.5-71.3 3.4-107q.34-53.4-3.26-106.9ZM207 353.89v-196.5l145 98.2Z"
							/>
						</svg>
					</button>

					<!-- undo-->
					<button
						@click.prevent="editor.chain().focus().undo().run()"
						class="hover:text-teal-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-6 h-6"
						>
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							>
								<path d="M5 9.5h10c.162 0 4 0 4 4c0 4.5-3.702 4.5-4 4.5H7" />
								<path d="M8.5 13L5 9.5L8.5 6" />
							</g>
						</svg>
					</button>

					<!-- redo-->
					<button
						@click.prevent="editor.chain().focus().redo().run()"
						class="hover:text-teal-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-6 h-6"
						>
							<g
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
							>
								<path d="M19 9.5H9c-.162 0-4 0-4 4C5 18 8.702 18 9 18h8" />
								<path d="M15.5 13L19 9.5L15.5 6" />
							</g>
						</svg>
					</button>

					<!-- <IconFormatPaint @click="editor.chain().focus().toggleHighlight().run()"
          class="w-8 cursor-pointer hover:text-cyan-600" :class="[editor.isActive('highlight') ? 'is-active text-teal-600' : '' ]" /> -->
				</div>
				<!-- add movie -->
				<div
					v-if="showAddYTLink"
					@keydown.esc="showAddYTLink = !showAddYTLink"
					class="absolute z-20 w-full p-2 bg-white top-[74px] border-stone-300 sm:top-[60px]"
					tabindex="0"
				>
					<div class="flex items-center h-full space-x-2">
						<input
							v-model="ytLink"
							v-focus
							type="url"
							class="w-full px-2 py-1 border rounded focus:outline-none focus:border-teal-500"
							placeholder="Enter a YouTube video URL"
						/>
						<button
							@click="addVideo"
							class="w-20 h-8 text-sm font-semibold text-white uppercase bg-teal-600 rounded"
							:class="[
								ytLink ? 'opacity-100' : 'opacity-50 pointer-events-none',
							]"
						>
							add
						</button>
					</div>
				</div>

				<!-- add youtube link -->
				<div
					v-if="showAddYTLink"
					@keydown.esc="showAddYTLink = !showAddYTLink"
					class="absolute z-20 w-full p-2 bg-white top-[74px] border-stone-300 sm:top-[60px]"
					tabindex="0"
				>
					<div class="flex items-center h-full space-x-2">
						<input
							v-model="ytLink"
							v-focus
							type="url"
							class="w-full px-2 py-1 border rounded focus:outline-none focus:border-teal-500"
							placeholder="Enter a YouTube video URL"
						/>
						<button
							@click="addVideo"
							class="w-20 h-8 text-sm font-semibold text-white uppercase bg-teal-600 rounded"
							:class="[
								ytLink ? 'opacity-100' : 'opacity-50 pointer-events-none',
							]"
						>
							add
						</button>
					</div>
				</div>

				<!-- add link -->
				<div
					v-if="showAddLink"
					@keydown.esc="showAddLink = !showAddLink"
					class="absolute z-10 w-full p-2 bg-white top-[74px] sm:top-[60px] border-stone-300"
					tabindex="0"
				>
					<div class="flex items-center h-full space-x-2">
						<input
							v-model="urlLink"
							v-focus
							type="url"
							class="w-full px-2 py-1 border rounded focus:outline-none focus:border-teal-500"
							placeholder="Enter a URL"
						/>
						<button
							@click="addLink"
							class="w-20 h-8 text-sm font-semibold text-white uppercase bg-teal-600 rounded"
							:class="[
								urlLink ? 'opacity-100' : 'opacity-50 pointer-events-none',
							]"
						>
							add
						</button>
					</div>
				</div>
			</div>
		</div>

		<editor-content
			:editor="editor"
			class="relative z-10 flex-grow w-full sm:pt-12 pt-20"
		/>

		<div class="relative">
			<bubble-menu
				class="flex items-center px-2 py-1 space-x-2 bg-black border rounded shadow border-stone-300 text-stone-400"
				:editor="editor"
				:tippy-options="{ duration: 100 }"
				v-if="editor"
			>
				<!-- h2 -->
				<button
					@click.prevent="
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					"
					class="hover:text-cyan-600"
					:class="[
						editor.isActive('heading', { level: 2 })
							? 'is-active text-teal-600'
							: '',
					]"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 48 48"
						class="w-6 h-6"
					>
						<path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="4"
							d="M6 8v32M24 8v32M7 24h16m9 1c0-3.167 2.667-5 5-5s5 1.833 5 5c0 5.7-10 9.933-10 15h10"
						/>
					</svg>
				</button>
				<!-- bold -->
				<button
					@click.prevent="editor.chain().focus().toggleBold().run()"
					class="hover:text-cyan-600"
					:class="[editor.isActive('bold') ? 'is-active text-teal-600' : '']"
				>
					<svg
						class="w-6 h-6"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.501 4.501 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.5 4.5 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<!-- code -->
				<button
					@click.prevent="editor.chain().focus().toggleCode().run()"
					class="hover:text-cyan-600"
					:class="[editor.isActive('code') ? 'is-active text-teal-600' : '']"
				>
					<svg
						class="w-6 h-6"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="m23 12-7.071 7.071-1.414-1.414L20.172 12l-5.657-5.657 1.414-1.414zM3.828 12l5.657 5.657-1.414 1.414L1 12l7.071-7.071 1.414 1.414z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<!-- code -->
				<button
					@click.prevent="editor.chain().focus().toggleHighlight().run()"
					class="cursor-pointer hover:text-teal-500"
					:class="[
						editor.isActive('highlight') ? 'is-active text-teal-500' : '',
					]"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M20.259 2.004a.75.75 0 0 1 .742.649l.007.102l-.004 4.497a2.254 2.254 0 0 1-2.001 2.234v2.26a2.25 2.25 0 0 1-2.096 2.245l-.154.005H16.5v2.792a2.25 2.25 0 0 1-1.14 1.958l-.155.08l-6.635 3.106a.75.75 0 0 1-1.061-.579l-.007-.1v-7.257H7.25A2.25 2.25 0 0 1 5.005 11.9L5 11.746v-2.26a2.25 2.25 0 0 1-1.994-2.072L3 7.25V2.754a.75.75 0 0 1 1.493-.102l.007.102V7.25c0 .38.282.694.648.744L5.25 8h13.501c.38 0 .695-.283.746-.649l.007-.101l.004-4.497a.75.75 0 0 1 .75-.75ZM15 13.996H9.003v6.077l5.567-2.606a.75.75 0 0 0 .424-.572l.008-.107L15 13.996ZM17.502 9.5H6.5v2.246c0 .38.282.694.648.743l.102.007h9.503a.75.75 0 0 0 .743-.648l.007-.102l-.001-2.246Z"
						/>
					</svg>
				</button>

				<!-- link -->
				<button
					@click.prevent="addLink"
					class="cursor-pointer hover:text-teal-500"
					:class="[editor.isActive('link') ? 'is-active text-teal-500' : '']"
				>
					<svg
						class="crayons-icon"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18.364 15.536 16.95 14.12l1.414-1.414a5.001 5.001 0 0 0-3.531-8.551 5 5 0 0 0-3.54 1.48L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 1 1 9.9 9.9l-1.415 1.414zm-2.828 2.828-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</bubble-menu>
		</div>

		<!-- <div>{{ editor.getHTML() }}</div>
    <div v-html="editor.getHTML()"></div> -->
	</div>
</template>

<script setup>
	import Document from "@tiptap/extension-document";
	import Link from "@tiptap/extension-link";
	import TextAlign from "@tiptap/extension-text-align";
	import StarterKit from "@tiptap/starter-kit";
	import Placeholder from "@tiptap/extension-placeholder";
	import Image from "@tiptap/extension-image";
	import Highlight from "@tiptap/extension-highlight";
	// import Blockquote from "@tiptap/extension-blockquote";
	import Youtube from "@tiptap/extension-youtube";
	import CharacterCount from "@tiptap/extension-character-count";
	import Table from "@tiptap/extension-table";
	import TableCell from "@tiptap/extension-table-cell";
	import TableHeader from "@tiptap/extension-table-header";
	import TableRow from "@tiptap/extension-table-row";
	import { BubbleMenu, useEditor, EditorContent } from "@tiptap/vue-3";
	import { Mark, markPasteRule, mergeAttributes } from "@tiptap/core";

	const props = defineProps(["content"]);
	const emit = defineEmits();
	const showAddYTLink = ref("");
	const showAddLink = ref("");
	const ytLink = ref("");
	const urlLink = ref("");

	const isUploadingImage = ref(false);

	const config = useRuntimeConfig();

	const validURL_REGEX =
		/^(?:https?:\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?(?!localhost)$/i;
	// Custom web preview extension
	const WebPreview = Link.extend({
		// addPasteRules() {
		//   return [
		//     markPasteRule({
		//       find: pasteRegex,
		//       type: this.type,
		//     }),
		//   ]
		// },
		name: "webpreview",
		onCreate() {
			// this.options.protocols.forEach(registerCustomProtocol)
			console.log("created", this);
		},

		addOptions() {
			return {
				openOnClick: true,
				linkOnPaste: true,
				autolink: true,
				protocols: [],
				HTMLAttributes: {
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					class: "bg-blue-600",
				},
				validate: undefined,
			};
		},

		addAttributes() {
			return {
				href: {
					default: null,
				},
				target: {
					default: this.options.HTMLAttributes.target,
				},
				class: {
					default: this.options.HTMLAttributes.class,
				},
			};
		},

		parseHTML() {
			return [{ tag: 'a[href]:not([href *= "javascript:" i])' }];
		},

		renderHTML({ HTMLAttributes }) {
			// console.log("renderHTML", this, HTMLAttributes)
			let url = HTMLAttributes.href;
			// console.log(url)
			// let res = fetch(url).then((r) => {
			//   console.log(r)
			// })
			// const embedUrl = getEmbedUrlFromYoutubeUrl({
			//   url: HTMLAttributes.src,
			//   allowFullscreen: this.options.allowFullscreen,
			//   autoplay: this.options.autoplay,
			//   ccLanguage: this.options.ccLanguage,
			//   ccLoadPolicy: this.options.ccLoadPolicy,
			//   controls: this.options.controls,
			//   disableKBcontrols: this.options.disableKBcontrols,
			//   enableIFrameApi: this.options.enableIFrameApi,
			//   endTime: this.options.endTime,
			//   interfaceLanguage: this.options.interfaceLanguage,
			//   ivLoadPolicy: this.options.ivLoadPolicy,
			//   loop: this.options.loop,
			//   modestBranding: this.options.modestBranding,
			//   nocookie: this.options.nocookie,
			//   origin: this.options.origin,
			//   playlist: this.options.playlist,
			//   progressBarColor: this.options.progressBarColor,
			//   startAt: HTMLAttributes.start || 0,
			// })

			// HTMLAttributes.src = embedUrl

			return [
				"div",
				{ "data-youtube-video": "" },
				[
					"iframe",
					mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
				],
			];
		},

		addPasteRules() {
			if (!this.options.addPasteHandler) {
				return [];
			}

			console.log("pasted");
			return [
				nodePasteRule({
					find: validURL_REGEX,
					type: this.type,
					getAttributes: (match) => {
						return { src: match.input };
					},
				}),
			];
		},
	});

	const vFocus = {
		mounted: (el) => el.focus(),
	};

	// const CustomDocument = Document.extend({
	//   // content: "heading block*",
	//   content: "block*",
	// });

	const editor = useEditor({
		extensions: [
			// CustomDocument,
			StarterKit.configure({
				// document: false,
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Image.configure({
				inline: true,
			}),
			Link.configure({
				openOnClick: true,
			}),
			// WebPreview,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Highlight,
			// Blockquote,
			CharacterCount,
			Youtube,
			Placeholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name == "paragraph") {
						return "Write something..";
					}

					return "Write something..";
				},
			}),
			Table,
			TableCell,
			TableHeader,
			TableRow,
		],
		editorProps: {
			attributes: {
				class:
					"prose lg:prose-lg xl:prose-2xl focus:outline-none px-2 py-4 overflow-y-scroll h-full",
			},
		},
		content: props.content,
		autofocus: true,
		onUpdate: ({ editor }) => {
			emit("update", editor.getJSON());
		},
	});

	const readData = (f) => {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(f);
		});
	};

	const uploadImage = async (event) => {
		isUploadingImage.value = true;

		let file = event.target.files[0];
		// const data = await readData(file);

		console.log("config", config.public.CLOUDINARY_UPLOAD_PRESET);
		let formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", config.public.CLOUDINARY_UPLOAD_PRESET);
		formData.append("folder", "pullonath");

		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${config.public.CLOUDINARY_NAME}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		const res = await response.json();

		if (res.secure_url) {
			editor.value.chain().focus().setImage({ src: res.secure_url }).run();
		}

		isUploadingImage.value = false;
	};

	// add YouTube video
	const addMovie = (slug) => {
		// get movie details

		// insert HTML
		editor.value.commands.insertContent(`<div
		class="flex flex-col sm:flex-row h-auto bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden"
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
	</div>`);
	};

	// add YouTube video
	const addVideo = (url) => {
		if (ytLink.value) {
			editor.value.commands.setYoutubeVideo({
				src: ytLink.value,
				width: 640,
				loading: "lazy",
			});
			ytLink.value = "";
			showAddYTLink.value = false;
		}
	};

	// add URL video
	const addLink = (url) => {
		const previousUrl = editor.value.getAttributes("link").href;
		// console.log(previousUrl)

		if (previousUrl) {
			editor.value.commands.unsetLink({
				href: urlLink.value,
			});
			return;
		}

		showAddLink.value = !showAddLink.value;

		if (urlLink.value) {
			editor.value.commands.setLink({
				href: urlLink.value,
			});
			urlLink.value = "";
			showAddLink.value = false;
		}
	};

	const linkHandler = (type) => {
		if (type == "youtube") {
			showAddLink.value = false;
			showAddYTLink.value = !showAddYTLink.value;
		} else {
			showAddYTLink.value = false;
			showAddLink.value = !showAddLink.value;
		}
	};

	// onBeforeUnmount(() => {
	//   editor.value.destroy();
	// });
</script>

<style>
	.ProseMirror {
		height: inherit;
		max-width: 100%;
		min-height: 20vh;
		background: #ffffff;
		color: #303030;
		/* height: 100%; */
		/* max-width: 100%; */
		/* padding: 1em; */
		/* border-left: 1px solid #b6b6b6;
  border-right: 1px solid #b6b6b6;
  border-bottom: 1px solid #b6b6b6; */
		/* background: #d6d6d6; */
		border-radius: 0 0 0px 0px;
		/* transition: color 0.3s ease-in-out; */
	}

	/* Placeholder (at the top) */
	/* .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
} */

	.ProseMirror p.is-editor-empty:first-child::before {
		content: attr(data-placeholder);
		float: left;
		color: #adb5bd;
		pointer-events: none;
		height: 0;
	}

	/* .ProseMirror p.is-empty::before {
		color: #adb5bd;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	} */

	.prose h1 {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
	}

	.prose h2 {
		margin-top: 1em;
		margin-bottom: 0.25em;
	}

	.prose h3 {
		margin-top: 1em;
		margin-bottom: 0.25em;
	}

	/* @media (prefers-color-scheme: dark) {
  .ProseMirror {
    background: #303030;
    color: #adb5bd;
    border-left: 1px solid #3e3e3e;
    border-right: 1px solid #3e3e3e;
    border-bottom: 1px solid #3e3e3e;
  }
} */

	iframe {
		width: 100%;
	}

	/* @media (prefers-color-scheme: dark) {
  .toolbar {
    background: #212121;
    border-left: 1px solid #3e3e3e;
    border-right: 1px solid #3e3e3e;
    border-top: 1px solid #3e3e3e;
  }
} */

	/* .prose :where(h1):not(:where([class~="not-prose"] *)) {
  color: #424242;
  font-weight: 800;
  font-size: 2.25em;
  margin-top: 0;
  margin-bottom: 0.8888889em;
  line-height: 1.1111111;
} */

	/* @media (prefers-color-scheme: dark) {
  .prose :where(h1):not(:where([class~="not-prose"] *)) {
    color: rgb(194, 194, 194);
    font-weight: 800;
    font-size: 2.25em;
    margin-top: 0;
    margin-bottom: 0.8888889em;
    line-height: 1.1111111;
  }
} */

	/* Placeholder (at the top) */
	/* .ProseMirror is-empty:first::before {
  content: attr(data-placeholder);
  float: left;
  color: #c2c3c4;
  pointer-events: none;
  height: 0;
} */

	/* Placeholder (on every new line) */
	/* .ProseMirror h1.is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #d2d2d2;
  pointer-events: none;
  height: 0;
} */

	/* @media (prefers-color-scheme: dark) {
  .ProseMirror h1.is-empty::before {
    color: #676767;
  }
} */

	.prose :where(a):not(:where([class~="not-prose"] *)) {
		color: rgb(28, 113, 174);
		text-decoration: none;
		font-weight: 500;
	}

	/* @media (prefers-color-scheme: dark) {
  .prose :where(a):not(:where([class~="not-prose"] *)) {
    color: rgb(28, 113, 174);
    text-decoration: none;
    font-weight: 500;
  }
} */

	/* @media (prefers-color-scheme: dark) {
  .prose :where(h2):not(:where([class~="not-prose"] *)) {
    color: #adb5bd;
  }
}

@media (prefers-color-scheme: dark) {
  .prose :where(h3):not(:where([class~="not-prose"] *)) {
    color: #adb5bd;
  }
} */

	.ProseMirror .prose {
		font-size: 0.9rem;
		padding: 0.5em;
		background-color: rgb(213, 213, 213);
		color: #616161;
		box-decoration-break: clone;
	}

	img {
		max-width: 100%;
		height: auto;
	}

	blockquote {
		padding-left: 1rem;
		border-left: 3px solid rgba(#0d0d0d, 0.1);
	}

	hr {
		border: none;
		border-top: 2px solid rgba(#0d0d0d, 0.1);
		margin: 2rem 0;
	}

	.prose :where(pre):not(:where([class~="not-prose"] *)) {
		background-color: #000000;
		color: #adb5bd;
	}

	.prose code {
		word-wrap: break-word;
		box-decoration-break: clone;
		border-radius: 0.2rem;
		border: 1px solid #dedede;
		color: rgb(100, 100, 100);
		background-color: #e7e7e7;
		padding-left: 4px;
		padding-right: 4px;
	}
	/* 
@media (prefers-color-scheme: dark) {
  .prose code {
    border: 1px solid #575757;
    color: #e19428;
    background-color: #575757;
  }
} */

	.prose pre code {
		color: rgb(255, 255, 255);
		background-color: transparent;
		font-family: "JetBrainsMono", monospace;
		border: none;
	}

	.prose :where(code):not(:where([class~="not-prose"] *))::before {
		content: "";
	}

	.prose :where(code):not(:where([class~="not-prose"] *))::after {
		content: "";
	}

	/* tables */
	table {
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		overflow: hidden;
	}

	td,
	th {
		min-width: 1em;
		border: 2px solid #ced4da;
		padding: 3px 5px;
		vertical-align: top;
		box-sizing: border-box;
		position: relative;
	}

	th {
		font-weight: bold;
		text-align: left;
		background-color: #f1f3f5;
	}

	.selectedCell:after {
		z-index: 2;
		position: absolute;
		content: "";
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(200, 200, 255, 0.4);
		pointer-events: none;
	}

	.column-resize-handle {
		position: absolute;
		right: -2px;
		top: 0;
		bottom: -2px;
		width: 4px;
		background-color: #adf;
		pointer-events: none;
	}

	p {
		margin: 0;
	}

	.tableWrapper {
		padding: 1rem 0;
		overflow-x: auto;
	}

	.resize-cursor {
		cursor: ew-resize;
		cursor: col-resize;
	}
</style>
