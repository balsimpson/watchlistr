<template>
	<div
		class="flex flex-col items-center justify-center h-full overflow-y-scroll sm:h-auto md:rounded-lg sm:flex-row bg-stone-900"
	>
		<div
			class="flex items-center justify-center w-full px-8 pt-12 text-center rounded-lg sm:w-1/2 text-stone-300"
		>
			<!-- <img
				src="https://source.unsplash.com/random?beach"
				alt=""
				class="object-cover h-64 sm:w-full md:rounded-lg sm:h-full"
			/> -->
			<div class="flex flex-col items-center justify-center pb-12">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 15 15"
					class="w-24 h-24"
				>
					<path
						fill="currentColor"
						d="M2.5 1A1.5 1.5 0 0 0 1 2.5V10a4 4 0 0 0 4 4v-1a3 3 0 0 1-3-3V7h3.5A1.5 1.5 0 0 0 7 5.5v-3A1.5 1.5 0 0 0 5.5 1h-3Zm7 0A1.5 1.5 0 0 0 8 2.5V10a4 4 0 0 0 4 4v-1a3 3 0 0 1-3-3V7h3.5A1.5 1.5 0 0 0 14 5.5v-3A1.5 1.5 0 0 0 12.5 1h-3Z"
					/>
				</svg>
				<div class="pt-6 font-arvo">
					{{ quote[1] }}
				</div>
			</div>
		</div>

		<div class="w-full p-6 sm:p-8 sm:w-1/2 bg-stone-800">
			<div class="rounded-b md:rounded-r md:rounded-l-none">
				<!-- register title -->
				<div v-if="isRegistering" class="mb-4">
					<div class="text-3xl font-extrabold text-teal-500">Register.</div>
					<!-- <div class="leading-4 text-gray-400 font-base text-md">
						Create custom lists, save your favourites and more.
					</div> -->
				</div>
				<!-- sign in title -->
				<div v-else class="mb-4">
					<div class="text-3xl font-extrabold text-zinc-300">Sign in.</div>
					<!-- <div class="leading-4 text-gray-500 font-base text-md">
						Create custom lists, save your favourites and more.
					</div> -->
				</div>
			</div>
			<form
				v-if="!isRegistering"
				@submit="login"
				class="space-y-4 text-gray-400"
			>
				<div>
					<label for="email" class="block text-sm font-medium text-left">
						<div
							v-if="isInvalidEmail"
							class="h-4 text-sm text-left text-amber-400"
						>
							Enter a valid email address
						</div>
						<div v-else>Email</div>
					</label>
					<div class="mt-1">
						<input
							v-model="inputEmail"
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required="true"
							placeholder="Your Email"
							class="w-full px-3 py-2 border rounded bg-stone-900 border-stone-700 text-stone-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-amber-500 placeholder-stone-600"
							:class="[isInvalidEmail || loginErrorMsg ? 'bg-amber-400' : '']"
						/>
					</div>
				</div>
				<div class="space-y-1">
					<label for="password" class="block text-sm font-medium text-left">
						Password
					</label>
					<div class="mt-1">
						<input
							v-model="inputPassword"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required="true"
							placeholder="Your Password"
							class="w-full px-3 py-2 border rounded bg-stone-900 border-stone-700 text-stone-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-amber-500 placeholder-stone-600"
						/>
					</div>
				</div>

				<div class="mt-1">
					<div class="mb-2 text-sm text-center text-amber-500">
						{{ loginErrorMsg }}
					</div>
					<button
						@click.prevent="login"
						class="flex items-center justify-center w-full py-2 font-semibold text-black rounded bg-amber-500"
						:disabled="isSigninActive"
						:class="[isSigninActive ? 'opacity-50 pointer-events-none' : '']"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<span class="pl-6"> Sign in </span>
					</button>

					<div class="h-4 my-2 text-sm text-center text-gray-500">
						Not registered?
						<span
							@click="isRegistering = !isRegistering"
							class="cursor-pointer text-amber-500"
							>Register</span
						>
					</div>
				</div>
			</form>

			<form v-else @submit="register" class="space-y-4 text-gray-400">
				<div>
					<label for="name" class="block text-sm font-medium text-left">
						Display Name
					</label>
					<div class="mt-1">
						<input
							v-model="displayNameInput"
							id="name"
							name="name"
							type="text"
							required="true"
							placeholder="Your Display Name"
							class="w-full px-3 py-2 border rounded bg-stone-900 border-stone-700 text-stone-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-amber-500 placeholder-stone-600"
							:class="[
								loginErrorMsg == 'Display name required'
									? 'border-red-500'
									: '',
							]"
						/>
					</div>
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-left">
						<div
							v-if="isInvalidEmail"
							class="h-4 text-sm text-left text-amber-400"
						>
							Enter a valid email address
						</div>
						<div v-else>Email</div>
					</label>
					<div class="mt-1">
						<input
							v-model="inputEmail"
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required="true"
							placeholder="Your Email"
							class="w-full px-3 py-2 border rounded bg-stone-900 border-stone-700 text-stone-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-amber-500 placeholder-stone-600"
							:class="[isInvalidEmail || loginErrorMsg ? 'bg-amber-200' : '']"
						/>
					</div>
				</div>
				<div class="space-y-1">
					<label for="password" class="block text-sm font-medium text-left">
						Password
					</label>
					<div class="mt-1">
						<input
							v-model="inputPassword"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required="true"
							placeholder="Your Password"
							class="w-full px-3 py-2 border rounded bg-stone-900 border-stone-700 text-stone-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-amber-500 placeholder-stone-600"
						/>
					</div>
				</div>

				<div class="mt-1">
					<div class="mb-2 text-sm text-center text-amber-500">
						{{ loginErrorMsg }}
					</div>
					<button
						@click.prevent="register"
						class="flex items-center justify-center w-full py-2 font-semibold text-black rounded bg-amber-500"
						:disabled="isSigninActive"
						:class="[isSigninActive ? 'opacity-50 pointer-events-none' : '']"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<span class="pl-6"> Register </span>
					</button>

					<div class="h-4 my-2 text-sm text-center text-gray-500">
						Already registered?
						<span
							@click="isRegistering = !isRegistering"
							class="cursor-pointer text-amber-500"
							>Sign in</span
						>
					</div>
				</div>
			</form>

			<div class="relative my-4 mt-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-700"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 text-gray-500 bg-stone-800"> or </span>
				</div>
			</div>

			<!-- social sign in -->
			<div
				class="flex flex-wrap items-center justify-center text-2xl text-gray-500"
			>
				<div
					class="transition flex items-center bg-gray-300 dark:bg-gray-200 hover:bg-[#4285f4] dark:hover:bg-[#4285f4] rounded-lg hover:shadow-lg group cursor-pointer hover:text-white m-2"
					@click="socialSignInHandler('google')"
				>
					<div class="bg-white rounded-l-lg">
						<svg
							viewBox="0 0 24 24"
							class="w-6 h-6 m-2"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
								<path
									fill="#4285F4"
									d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
								/>
								<path
									fill="#34A853"
									d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
								/>
								<path
									fill="#FBBC05"
									d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
								/>
								<path
									fill="#EA4335"
									d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
								/>
							</g>
						</svg>
					</div>
					<span
						class="px-3 text-base font-semibold text-gray-600 transition dark:text-gray-500 group-hover:text-gray-300"
						>Sign In with Google</span
					>
				</div>

				<!-- <div
          class="
            m-2
            flex
            items-center
            p-2
            bg-white
            rounded-[3px]
            shadow
            group
            hover:bg-gray-800
            cursor-pointer
            text-gray-600
            hover:text-gray-300
          "
          @click="socialSignInHandler('github')"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
            image-rendering="optimizeQuality"
            fill-rule="evenodd"
            clip-rule="evenodd"
            viewBox="0 0 640 640"
            fill="currentColor"
          >
            <path
              d="M319.988 7.973C143.293 7.973 0 151.242 0 327.96c0 141.392 91.678 261.298 218.826 303.63 16.004 2.964 21.886-6.957 21.886-15.414 0-7.63-.319-32.835-.449-59.552-89.032 19.359-107.8-37.772-107.8-37.772-14.552-36.993-35.529-46.831-35.529-46.831-29.032-19.879 2.209-19.442 2.209-19.442 32.126 2.245 49.04 32.954 49.04 32.954 28.56 48.922 74.883 34.76 93.131 26.598 2.882-20.681 11.15-34.807 20.315-42.803-71.08-8.067-145.797-35.516-145.797-158.14 0-34.926 12.52-63.485 32.965-85.88-3.33-8.078-14.291-40.606 3.083-84.674 0 0 26.87-8.61 88.029 32.8 25.512-7.075 52.878-10.642 80.056-10.76 27.2.118 54.614 3.673 80.162 10.76 61.076-41.386 87.922-32.8 87.922-32.8 17.398 44.08 6.485 76.631 3.154 84.675 20.516 22.394 32.93 50.953 32.93 85.879 0 122.907-74.883 149.93-146.117 157.856 11.481 9.921 21.733 29.398 21.733 59.233 0 42.792-.366 77.28-.366 87.804 0 8.516 5.764 18.473 21.992 15.354 127.076-42.354 218.637-162.274 218.637-303.582 0-176.695-143.269-319.988-320-319.988l-.023.107z"
            />
          </svg>
          <span
            class="px-2 text-base font-semibold text-gray-600 group-hover:text-gray-300 "
            >Github</span
          >
        </div>

        

        <div
          class="
            m-2
            flex
            items-center
            p-2
            bg-white
            rounded-[3px]
            shadow
            group
            hover:bg-blue-600
            cursor-pointer
          "
          @click="socialSignIn('facebook')"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 333333 333333"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
            image-rendering="optimizeQuality"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path
              d="M197917 62502h52080V0h-52080c-40201 0-72909 32709-72909 72909v31250H83337v62507h41659v166667h62506V166666h52080l10415-62506h-62496V72910c0-5648 4768-10415 10415-10415v6z"
              fill="#3b5998"
            />
          </svg>
          <span
            class="px-2 text-base font-semibold text-gray-600 group-hover:text-gray-300 "
            >Facebook</span
          >
        </div> -->
			</div>
		</div>
	</div>
</template>

<script setup>
	const quote = [
		"You’ve got an overdeveloped sense of vengeance. It’s going to get you into trouble one of these days.",

		"We met at Starbucks. Not the same Starbucks, she was in the Starbucks across the street from the Starbucks I was in.",

		"Are you crazy? You fed a baby chili?",

		"Want a beer? \nIt’s eight o’clock in the morning…",
	];
	const emit = defineEmits(["login"]);
	const inputEmail = ref("");
	const inputPassword = ref("");
	const displayNameInput = ref("");

	const isInvalidEmail = ref(false);
	const isRegistering = ref(false);

	const giphyUrls = [
		"https://media.giphy.com/media/5nkwQ6TSx9SgAHqtdi/giphy.gif",
		"https://media.giphy.com/media/TYUOVlYpCe2M8/giphy.gif",
		"https://media.giphy.com/media/MbNUJR7sPSkqlCHhS6/giphy.gif",
	];

	const loginErrorMsg = ref("");
	// const isSigninActive = ref(true);
	const isSigninActive = computed(() => {
		if (inputEmail.value && inputPassword.value) {
			return false;
		} else {
			return true;
		}
	});

	const processErrorMsg = (error) => {
		console.log("process-error", typeof error, JSON.stringify(error));
		let errorMsg = "";
		if (error.code == "auth/user-not-found") {
			errorMsg = "User not found. Please register.";
		} else if (error.code === "auth/wrong-password") {
			errorMsg = "Wrong password";
		} else if (error.code === "auth/invalid-email") {
			errorMsg = "Invalid email";
		} else if (error.code === "auth/email-already-in-use") {
			errorMsg = "Email already in use";
		} else {
			errorMsg = error.message;
		}

		console.log("login-error-msg", errorMsg);
		return errorMsg;
	};

	const login = async () => {
		isInvalidEmail.value = validateEmail(inputEmail.value);

		if (!isInvalidEmail.value) {
			// console.log("email invalid", isInvalidEmail.value);
			try {
				let res = await signInUser(inputEmail.value, inputPassword.value);

				if (res.user) {
					emit("login", res.user);
					console.log("login success", res);
				} else {
					console.log("login fail", res);
					loginErrorMsg.value = res;
					setTimeout(() => {
						loginErrorMsg.value = "";
					}, 3000);
				}
				// console.log("res", res);
				// save to store
				// emit("login", res);
				return res;
			} catch (error) {
				// console.log("error", error);
				processErrorMsg(error);
			}
		} else {
			console.log("email valid", isInvalidEmail.value);
		}
	};

	const register = async () => {
		if (displayNameInput.value) {
			isRegistering.value = true;
			console.log(
				"registering",
				inputEmail.value,
				inputPassword.value,
				displayNameInput.value
			);

			let res = await createUser(
				inputEmail.value,
				inputPassword.value,
				displayNameInput.value
			);

			if (res.user) {
				console.log("res", res);
				emit("login", res.user);
			} else {
				if (res && res.message) {
					loginErrorMsg.value = processErrorMsg(res);

					setTimeout(() => {
						loginErrorMsg.value = "";
					}, 3000);
				}
			}
		} else {
			console.log("display name required");
			loginErrorMsg.value = "Display name required";

			setTimeout(() => {
				loginErrorMsg.value = "";
			}, 3000);
		}
	};

	const socialSignInHandler = async (signinProvider) => {
		let res = await socialSignIn(signinProvider);

		if (res && res.user) {
			emit("login", res.user);
			// console.log(res.user);
		} else {
			if (res && res.message) {
				loginErrorMsg.value = processErrorMsg(res);

				setTimeout(() => {
					loginErrorMsg.value = "";
				}, 3000);
			}
		}
	};

	function validateEmail(inputText) {
		let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (inputText.match(mailformat)) {
			return false;
		} else {
			return true;
		}
	}
</script>
