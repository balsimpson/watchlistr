<template>
	<div class="w-full py-6 bg-transparent">
		<!-- nav -->
		<nav
			class="flex items-center justify-between w-full max-w-4xl px-4 mx-auto"
		>
			<NuxtLink to="/">
				<img src="/watchlistr_logo_white.png" alt="SICHREM logo" class="w-36" />
			</NuxtLink>
			<div class="flex items-center sm:space-x-4">
				<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:text-white" -->
				<!-- <a
				href="#"
				class="px-3 py-2 text-sm font-bold text-gray-900 rounded-md"
				aria-current="page"
				>Our Projects</a
			> -->

				<!-- <NuxtLink
				to="/blog"
				class="px-3 py-2 text-sm font-bold text-gray-900 rounded-md hover:text-gray-900"
			>
				Blog
			</NuxtLink> -->

				<!-- <NuxtLink
				to="/aboutus"
				class="px-3 py-2 text-sm font-bold text-gray-900 rounded-md hover:text-gray-900"
			>
				About Us
			</NuxtLink> -->

				<!-- <a
				href="#"
				class="px-3 py-2 text-sm font-bold text-gray-900 rounded-md hover:text-gray-900"
				>Blog</a
			> -->

				<NuxtLink
					to="/blog"
					class="text-base font-medium text-white rounded-md"
				>
					Blog
				</NuxtLink>

				<div v-if="firebaseUser" class="relative flex items-center px-5">
					<button @click.prevent="isActive = !isActive" class="flex-shrink-0">
						<img
							v-if="firebaseUser.photoURL"
							class="w-8 h-8 rounded-full"
							:src="firebaseUser.photoURL"
							alt=""
						/>

						<div
							v-else
							class="flex items-center justify-center w-8 h-8 text-2xl rounded-full bg-amber-200"
						>
							A
						</div>
					</button>
					<div class="hidden ml-3">
						<!-- <div class="max-w-xs text-base font-medium leading-none text-white">
							{{ firebaseUser }}
						</div> -->
						<div class="text-base font-medium leading-none text-white">
							{{ firebaseUser.displayName }}
						</div>
						<div class="text-sm font-medium leading-none text-gray-400">
							{{ firebaseUser.email }}
						</div>
					</div>

					<Transition name="modal">
						<div
							v-if="isActive"
							class="absolute z-10 w-48 py-1 mt-2 origin-top-right divide-y rounded-md shadow-lg bg-stone-800/90 right-2 top-10 ring-1 ring-black ring-opacity-5 focus:outline-none divide-stone-800"
							role="menu"
							aria-orientation="vertical"
							aria-labelledby="user-menu-button"
							tabindex="-1"
							id="modal"
						>
							<!-- Active: "bg-gray-100", Not Active: "" -->
							<NuxtLink
								@click.prevent="isActive = !isActive"
								to="/user/watchlist"
								class="block px-4 py-2 text-sm text-stone-300 hover:bg-stone-700"
							>
								Your Watchlist
							</NuxtLink>
							<a
								href="#"
								class="block w-full px-4 py-2 text-sm text-stone-300 hover:bg-stone-700"
								role="menuitem"
								tabindex="-1"
								>Settings</a
							>
							<button
								@click="signOut"
								class="w-full px-4 py-2 text-sm text-left text-amber-300 hover:bg-stone-700"
								role="menuitem"
								tabindex="-1"
							>
								Sign out
							</button>
						</div>
					</Transition>
				</div>

				<button
					v-else
					@click.prevent="isModalActive = !isModalActive"
					class="flex items-center px-5 font-medium text-gray-500 gap-x-2 hover:text-amber-600"
					href="#"
				>
					<svg
						class="w-4 h-4"
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
						/>
					</svg>
					Sign in
				</button>
			</div>
		</nav>

		<AppModalAnimated
			:isActive="isModalActive"
			@close="isModalActive = !isModalActive"
			class="flex items-center"
		>
			<LoginForm @login="signIn"/>
		</AppModalAnimated>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: ["auth"],
	});

	const router = useRouter()
	const firebaseUser = useFirebaseUser();
	// const modal = ref(null);
	const isActive = ref(false);
	const isModalActive = ref(false);
	
	const signIn = () => {
		console.log("signedin");
		isModalActive.value = false;
		addToWatchlistBtnHandler()
	}
	
	const signOut = async () => {
		// console.log("signing out");
		await signOutUser();
		// router.push("/");
	};
</script>

<style>
	.modal {
		position: relative;
		background-color: white;
		padding: 50px 100px;
		border-radius: 5px;
	}

	.modal-enter-active,
	.modal-leave-active {
		transition: all 0.25s ease-in-out;
	}
	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
		/* transform: scale(1.1); */
	}
</style>
