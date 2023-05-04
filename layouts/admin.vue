<template>
	<div class="flex flex-col">
		<!-- ========== MAIN CONTENT ========== -->
		<!-- Sidebar Toggle -->
		<div
			class="sticky top-0 inset-x-0 z-20  border-y px-4 sm:px-6 md:px-8 lg:hidden"
		>
			<div class="flex items-center py-4 justify-between">
				<!-- Navigation Toggle -->
				<button
					@click.prevent="isSidebarOpen = !isSidebarOpen"
					type="button"
					class="text-gray-500 hover:text-gray-600"
					aria-controls="application-sidebar"
					aria-label="Toggle navigation"
				>
					<span class="sr-only">Toggle Navigation</span>
					<svg
						class="w-5 h-5"
						width="16"
						height="16"
						fill="currentColor"
						viewBox="0 0 16 16"
					>
						<path
							d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
						/>
					</svg>
				</button>
				<!-- End Navigation Toggle -->

				<!-- Breadcrumb -->
				<!-- <ol
					class="ml-3 flex items-center whitespace-nowrap min-w-0"
					aria-label="Breadcrumb"
				>
					<li
						class="flex items-center text-sm text-gray-800 dark:text-gray-400"
					>
						/
						<svg
							class="flex-shrink-0 mx-3 overflow-visible h-2.5 w-2.5 text-gray-400 dark:text-gray-600"
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
								stroke="currentColor"
							/>
						</svg>
					</li>
					<li
						class="text-sm font-semibold text-gray-800 truncate dark:text-gray-400"
						aria-current="page"
					>
						Posts
					</li>
				</ol> -->
				<!-- End Breadcrumb -->
			</div>
		</div>
		<!-- End Sidebar Toggle -->

		<!-- Sidebar -->
		<!-- <div
			id="application-sidebar"
			class="transition-all flex h-screen flex-col duration-300 transform fixed top-0 left-0 bottom-0 z-[60] w-64 -translate-x-full bg-white border-r  border-gray-200 pt-7 pb-3 overflow-y-auto scrollbar-y lg:flex lg:translate-x-0"
			:class="[isSidebarOpen ? 'translate-x-0' : 'hidden ']"
		> -->
		<div
			id="application-sidebar"
			class="w-64 flex flex-col absolute top-0 overflow-y-auto h-screen space-y-6 border-r px-2 py-4 border-black lg:-translate-x-0 bg-black text-gray-200 transform transition duration-200 ease-in-out z-30 shadow-md"
			:class="[isSidebarOpen ? ' -translate-x-0' : '-translate-x-full']"
		>
			<div class="px-6 flex items-center border-b pb-6 border-gray-800">
				<!-- <img src="/favicon.png" alt="" class="w-12" /> -->
				<div>
					<div class="ml-3 font-bold text-xl tracking-wide">Watchlistr</div>
					<div class="ml-3 font-semibold text-gray-600">Admin Panel</div>
				</div>
			</div>
			<button
				@click.prevent="isSidebarOpen = !isSidebarOpen"
				class="absolute right-3 top-0 text-gray-400 lg:hidden"
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<nav class="p-6 w-full flex flex-col flex-wrap flex-grow">
				<ul class="space-y-1.5">

					<li>
						<NuxtLink
							to="/admin"
							class="flex items-center gap-x-3.5 py-2 px-2.5 text-lg text-gray-400 rounded-md hover:bg-gray-200 hover:text-gray-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-6 h-6"
							>
								<path
									d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
								/>
							</svg>

							Media
						</NuxtLink>
					</li>
					<li>
						<NuxtLink
							to="/admin/posts"
							class="flex items-center gap-x-3.5 py-2 px-2.5 text-lg text-gray-400 rounded-md hover:bg-gray-200 hover:text-gray-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-6 h-6"
							>
								<path
									d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z"
								/>
								<path
									d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z"
								/>
							</svg>

							Posts
						</NuxtLink>
					</li>

					
					
				</ul>
			</nav>
			<div v-if="firebaseUser" class="px-6 text-gray-500">
				<div class="text-sm">{{ firebaseUser.email }}</div>
				<button
					@click.prevent="signOut"
					class="flex items-center gap-x-3.5 py-2 text-sm text-gray-500 rounded-md hover:text-gray-300 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
							clip-rule="evenodd"
						/>
						<path
							fill-rule="evenodd"
							d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
							clip-rule="evenodd"
						/>
					</svg>

					Sign Out
				</button>
			</div>
		</div>
		<!-- End Sidebar -->

		<!-- Content -->
		<div
			class="w-full lg:h-screen h-[calc(100vh-54px)] lg:pl-72 max-w-4xl lg:max-w-7xl overflow-hidden"
		>
			<slot />
		</div>
		<!-- End Content -->
		<!-- ========== END MAIN CONTENT ========== -->
	</div>
</template>

<script setup>
	const isSidebarOpen = ref(false);
	const firebaseUser = useFirebaseUser();
	const router = useRouter();

	const signOut = async () => {
		// console.log("signing out");
		await signOutUser();
		router.push("/admin/sign-in");
	};
</script>

<style>
	/* .router-link-active {
		font-weight: bold;
		background-color: aliceblue;
		color: black;
	}
	.router-link-exact-active {
		font-weight: bold;
	} */
</style>
