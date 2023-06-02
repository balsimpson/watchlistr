<template>
	<div>
		<div class="max-w-3xl p-6 mx-auto md:text-center">
			<h2 class="text-base font-semibold leading-7 text-indigo-400">
				Your Watchlist
			</h2>
			<p
				class="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl"
			>
				Everything you need for a movie marathon
			</p>
			<!-- <p class="mt-6 text-sm leading-5 text-gray-400">
				You can add up to 20 movies to your watchlist. This is deliberate.
				Nobody wants an endless list that you never watch. So choose carefully.
			</p> -->

			<div
				v-if="firebaseItems && firebaseItems.length"
				class="grid grid-cols-2 gap-6 mt-12 md:grid-cols-3 gap-y-12"
			>
				<div v-for="item in firebaseItems">
					<!-- <NuxtLink v-if="item" :to="'/' + item.media_type + '/' + item.slug"> -->
					<AppCardImgTitle :item="item" />
					<!-- </NuxtLink> -->
				</div>
			</div>
			<div v-else>
				<div
					class="flex flex-col items-center text-center pt-36 text-stone-400"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
						/>
					</svg>

					<div class="pt-6 text-sm font-semibold">Your Watchlist is empty</div>
				</div>

				<NuxtLink
					to="/"
					class="flex items-center justify-center w-full max-w-[200px] py-2 mx-auto mt-6 font-semibold text-black rounded bg-amber-500 hover:bg-amber-600 transition"
				>
					<span class="pr-6"> Browse Movies </span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
						/>
					</svg>
				</NuxtLink>
			</div>

            <!-- <pre>{{ data }}</pre> -->
		</div>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: ["auth"],
	});
	const firebaseItems = useFirebaseItems();
	const firebaseUser = useFirebaseUser();

    watchEffect(async () => {
        if (firebaseUser.value && firebaseUser.value.uid) {
            
            const data = await getSubcollectionFromFirestore(firebaseUser.value.uid, "users", "watchlist");
        
            // firebaseItems.value = data.value;
            // console.log(data, firebaseUser.value.uid);
        }
    })

</script>
