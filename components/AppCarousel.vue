<template>
	<div
	v-if="items"
		class="flex max-w-5xl mx-auto mt-2 space-x-2 overflow-scroll snap-mandatory snap-x scroll-container"
	>
	<!-- <pre class="text-stone-400">{{ items }}</pre> -->
		<AppCardImg v-for="item in items" :key="item"></AppCardImg>
		<!-- <div class="max-w-96 shrink-0 snap-start">
			<a
				href="/list/an-enjoyable-agatha-christie-murder-mystery_2I8uy0nB0FmQhZQSfwOH"
				class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								An enjoyable Agatha Christie murder mystery
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/drama" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Drama
										</div></a
									>
								</div>
								<div>
									<a href="/genre/mystery" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Mystery
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/8T8G7k5Le8e1r2Y2trCcywXTYRo.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div>
		<div class="max-w-96 shrink-0 snap-start">
			<a
				href="/list/yellowjackets-is-a-must-watch_2bi9jII9rYvap1lg0wgo"
				class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								Yellowjackets is a must watch!
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/drama" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Drama
										</div></a
									>
								</div>
								<div>
									<a href="/genre/mystery" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Mystery
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/6NtCpGAX8PYPcp2iMjlQMTuVvw8.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div>
		<div class="max-w-96 shrink-0 snap-start">
			<a
				href="/list/steve-martin-martin-short-and-selena-gomez-turn-investigators_9AG3TJ1PspkOastWI7vM"
				class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								Steve Martin, Martin Short and Selena Gomez Turn Investigators
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/comedy" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Comedy
										</div></a
									>
								</div>
								<div>
									<a href="/genre/crime" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Crime
										</div></a
									>
								</div>
								<div>
									<a href="/genre/mystery" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Mystery
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/lxCmHIN7TTO0sxeAmgDYxqzq8Ob.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div>
		<div class="max-w-96 shrink-0 snap-start">
			<a
				href="/list/new-age-cowboys-discover-time-travel_HFw6Jh5lGXWZ0HdI8JvT"
				class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								New Age Cowboys discover time travel?
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/western" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Western
										</div></a
									>
								</div>
								<div>
									<a href="/genre/mystery" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Mystery
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/nO2qkja0cYBlx59fJ89TnrzDvHe.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div>
		<div class="max-w-96 shrink-0 snap-start">
			<a href="/list/after-party-is-great-fun_UkuTUkyVx7lPqE9K4GqY" class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								After Party Is Great Fun
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/mystery" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Mystery
										</div></a
									>
								</div>
								<div>
									<a href="/genre/comedy" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Comedy
										</div></a
									>
								</div>
								<div>
									<a href="/genre/crime" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Crime
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/9iAxAxeX5RjB39ckhxPMDCJPpG9.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div>
		<div class="max-w-96 shrink-0 snap-start">
			<a
				href="/list/severance-is-creepy-and-disturbing_fq2osv7BGtmyv4xEMIJt"
				class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								Severance is creepy and disturbing
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/drama" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Drama
										</div></a
									>
								</div>
								<div>
									<a href="/genre/scifi-fantasy" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Sci-Fi &amp; Fantasy
										</div></a
									>
								</div>
								<div>
									<a href="/genre/mystery" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Mystery
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/lFf6LLrQjYldcZItzOkGmMMigP7.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div>
		<div class="max-w-96 shrink-0 snap-start">
			<a href="/list/story-of-wework_jZy88xu5rUDXqJhT0VQR" class=""
				><div
					class="relative transition border border-transparent rounded-lg shadow hover:border-brand-500 group"
				>
					<div class="absolute inset-0 rounded-lg bg-gradient-to-t from-black">
						<div class="absolute inset-x-0 bottom-5">
							<div
								class="px-2 pb-2 leading-4 text-center text-gray-200 capitalize transition group-hover:-translate-y-1 group-hover:text-brand-500"
							>
								Story of WeWork
							</div>
							<div
								class="w-24 h-1 mx-auto transition bg-brand-400 group-hover:bg-brand-500"
							></div>
							<div
								class="pt-2 text-sm leading-4 text-center text-gray-400"
							></div>
							<div class="flex flex-wrap justify-center gap-1 px-3">
								<div>
									<a href="/genre/drama" class=""
										><div
											class="inline-flex px-3 py-1 text-xs transition rounded-full text-zinc-200 shrink-0 bg-zinc-600 hover:bg-zinc-300 hover:text-zinc-600"
										>
											Drama
										</div></a
									>
								</div>
							</div>
						</div>
					</div>
					<img
						loading="lazy"
						src="https://image.tmdb.org/t/p/w342/rFlYeo84b5YtzNkN0IonN6ZCPic.jpg"
						alt=""
						class="object-cover w-64 rounded-lg h-96"
					/></div
			></a>
		</div> -->
	</div>
</template>

<script setup>
defineProps(["items"])
</script>
