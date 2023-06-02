<template>
	<div
		v-if="post"
		class="flex flex-wrap items-center justify-center max-w-4xl px-6 mx-auto mt-3 sm:px-3 sm:mt-12"
	>
		<!-- <pre class="text-stone-400">{{ post }}</pre> -->
		<div class="grid w-full gap-6 sm:grid-cols-6 text-stone-400">
			<div class="relative sm:col-span-2">
				<img
					class="object-cover object-center w-full h-64 mx-auto rounded-lg sm:h-auto"
					:alt="post.title"
					:src="getImageURL(post.poster_path)"
				/>

				<button
					@click.prevent="addToWatchlistBtnHandler"
					class="flex items-center justify-center w-full px-6 py-3 mt-3 text-sm font-semibold tracking-wider uppercase transition duration-300 ease-in-out rounded-lg shadow-lg bg-amber-500 hover:bg-amber-600 text-stone-800 sm:text-base"
					:class="[
						addToWatchlistBtnTxt == 'Adding...'
							? 'opacity-40 pointer-events-none'
							: '',
						addToWatchlistBtnTxt == 'Added!'
							? 'bg-teal-600 text-teal-800 pointer-events-none'
							: '',
						addToWatchlistBtnTxt == 'Remove from Watchlist'
							? 'bg-amber-400 text-stone-800'
							: '',
					]"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 shrink-0"
						:class="[
							addToWatchlistBtnTxt == 'Adding...' ? 'animate-spin' : '',
							addToWatchlistBtnTxt == 'Remove from Watchlist'
								? 'rotate-45'
								: '',
						]"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 4.5v15m7.5-7.5h-15"
						/>
					</svg>

					<span class="ml-6 leading-5 text-left">{{
						addToWatchlistBtnTxt
					}}</span>
				</button>
			</div>
			<div class="sm:col-span-4">
				<h1
					class="text-5xl font-bold leading-none tracking-tighter text-center sm:text-left md:text-6xl"
				>
					<span class="text-stone-300"> {{ post.title }} </span>
				</h1>
				<div class="pt-3 space-x-6 text-base text-center sm:text-left">
					<span class="italic">{{ post.release_date.split("-")[0] }}</span>
					<span>{{ post.runtime }} min</span>
					<!-- <span class="text-cyan-400">Movie</span> -->
				</div>

				<!-- <pre>{{ post }}</pre> -->

				<div class="mt-4">
					<h2
						class="mb-2 text-xl font-semibold leading-none text-center text-stone-400 sm:text-left"
					>
						Language
					</h2>
					<p class="mb-4 leading-6 text-center text-stone-400 sm:text-left">
						{{ getSpokenLanguage(post.spoken_languages).join(", ") }}
					</p>
				</div>

				<div class="flex flex-wrap justify-center gap-2 mt-3 sm:justify-start">
					<TypeChip v-for="genre in post.genres" :key="post" :title="genre" />
				</div>

				<p
					class="pt-3 mt-2 mb-4 leading-6 text-center text-stone-400 sm:text-left"
				>
					{{ post.overview }}
				</p>

				<div>
					<h2
						class="mb-2 text-2xl font-bold leading-none tracking-tighter text-center text-stone-400 sm:text-left md:text-4xl"
					>
						Crew
					</h2>
					<ul
						class="mt-2 mb-4 text-sm leading-6 text-center text-stone-400 sm:text-left"
					>
						<!-- loop through each crew member -->
						<li
							class="mb-2"
							v-for="member in getFormattedCrew(post.crew)"
							:key="member[0]"
						>
							<span class="font-bold">{{ member[0] }}:</span>
							{{ member[1].join(", ") }}
						</li>
					</ul>

					<h2
						class="mb-2 text-2xl font-bold leading-none tracking-tighter text-center text-stone-400 sm:text-left md:text-4xl"
					>
						Cast
					</h2>

					<div class="flex flex-wrap justify-center gap-x-3 sm:justify-start">
						<div v-for="item in post.cast" :key="item.name">
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- <CarouselMovieCard :id="post.id" /> -->

		<div class="flex flex-col py-12 sm:px-6">
			<p class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">
				You may also like
			</p>
			
			<AppCarousel :items="similar_movies"/>
		</div>

		<!-- {{ similar_movies }} -->

		<AppModalAnimated
			:isActive="isModalActive"
			@close="isModalActive = !isModalActive"
			class="flex items-center"
		>
			<LoginForm @login="signIn" />
		</AppModalAnimated>
	</div>
</template>

<script setup>
	definePageMeta({
		layout: "default",
	});
	const firebaseUser = useFirebaseUser();
	const firebaseItems = useFirebaseItems();
	const route = useRoute();
	const isModalActive = ref(false);
	const isInWatchlist = ref(false);

	const addToWatchlistBtnTxt = ref("Add to Watchlist");
	const { data: post } = await useFetch(
		`/api/media/?slug=${route.params.slug}`,
		{ initialCache: false }
	);

	useHead({
		title: () => post?.value?.title,
		meta: [
			{
				name: "description",
				content: () => post?.value?.description,
			},
			{
				property: "og:title",
				content: () => post?.value?.title,
			},
			{
				property: "og:description",
				content: () => post?.value?.overview,
			},
			{
				property: "og:image",
				content: () => getImageURL(post.value.poster_path),
			},
			{
				property: "og:url",
				content:
					"https://watchlistr.in/" +
					post.value.media_type +
					"/" +
					post.value.slug,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: () => post.value?.title,
			},
			{
				name: "twitter:description",
				content: () => post.value?.overview,
			},
			{
				name: "twitter:image",
				content: () => getImageURL(post.value.poster_path),
			},
		],
	});

	const signIn = () => {
		console.log("signedin");
		isModalActive.value = false;
		// addToWatchlistBtnHandler()
	};

	const addToWatchlistBtnHandler = async () => {
		// console.log("firebaseUser", firebaseUser);
		if (addToWatchlistBtnTxt.value == "Remove from Watchlist") {
			// console.log("user", post.value, firebaseItems.value[0]);
			addToWatchlistBtnTxt.value = "Removing...";
			// remove doc from watchlist
			let res = await deleteDocFromSubcollection(
				"users/" + firebaseUser.value.uid,
				"watchlist",
				post.value.uid
			);

			console.log("res", res);

			addToWatchlistBtnTxt.value = "Removed!";
			setTimeout(() => {
				addToWatchlistBtnTxt.value = "Add to Watchlist";
			}, 1000);

			let items = firebaseItems.value.filter((item) => {
				// console.log(item);
				item.id !== post.value.id;
			});
			firebaseItems.value = items;
		} else {
			if (!firebaseUser.value) {
				isModalActive.value = !isModalActive.value;
			} else {
				// add to list on user db
				addToWatchlistBtnTxt.value = "Adding...";
				// addToWatchlistBtnTxt.value = "Added!"
				// addToWatchlistBtnTxt.value = "Remove from Watchlist"
				let docExists = await checkIfDocExists(firebaseUser.value.uid, "users");

				// console.log(docExists);

				// let result = await addDocWithId(
				// 	"users",
				// 	firebaseUser,
				// 	firebaseUser.value.uid
				// );

				let result = await addDocToSubcollection(
					"users",
					firebaseUser.value.uid,
					"watchlist",
					post.value
				);

				addToWatchlistBtnTxt.value = "Added!";
				setTimeout(() => {
					addToWatchlistBtnTxt.value = "Remove from Watchlist";
				}, 5000);

				firebaseItems.value.unshift(post.value);
				checkIfInWatchlist();
				// console.log(result);
			}
		}
	};

	const checkIfInWatchlist = () => {
		let items = firebaseItems.value.filter((item) => {
			// console.log(item);
			if (item.slug == post.value.slug) {
				post.value.uid = item.uid;
				return item;
			}
		});

		if (items.length) {
			isInWatchlist.value = true;
			addToWatchlistBtnTxt.value = "Remove from Watchlist";
		}
		// console.log(items, firebaseItems.value);
	};

	const { data: similar_movies } = await useFetch(
		`/api/genre/?genre=${post.value.genres[0]}&count=5`,
		{ initialCache: false }
	);

	watchEffect(() => {
		// console.log("change");
		checkIfInWatchlist();
	});

	onMounted(() => {
		// checkIfInWatchlist();
		// incrementPageView("media", post.value.id);
	});
</script>

<style></style>
