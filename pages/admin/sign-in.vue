<template>
    <div class="flex items-center justify-center min-h-screen bg-white">
      <div class="w-full max-w-sm px-2 py-12 mx-auto bg-transparent sm:px-12">
  
  
        <div class="w-full mx-auto">
          
          <div class="flex flex-col w-full items-center justify-center pb-12">
            <img src="/favicon.png" alt="" class="w-10">
            <div>Admin Panel</div>
          </div>
          <form @submit="login" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-bold text-left text-gray-500">
                Email
              </label>
              <div class="mt-1">
                <input v-model="emailInput" type="email" autocomplete="email" required="true" placeholder="you@email.com"
                  class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-[#009cd9] focus:border-[#009cd9] " />
              </div>
            </div>
            <div class="space-y-1">
              <label for="password" class="block text-sm font-bold text-left text-gray-500">
                Password
              </label>
              <div class="mt-1">
                <input v-model="passwordInput" id="password" type="password" autocomplete="current-password"
                  required="true" placeholder="password"
                  class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-[#009cd9] focus:border-[#009cd9] " />
              </div>
            </div>

            <div class="mt-1">
              <div class="h-2 mb-4 text-sm text-center text-red-500">
                {{ loginErrorMsg }}
              </div>
              <button @click.prevent="login"
                class="flex items-center justify-center w-full px-4 py-2 font-bold text-white rounded focus:outline-none focus:ring-teal-800 focus:ring-2 focus:ring-offset-0"
                :class="[
                  emailInput && passwordInput
                    ? 'bg-[#009cd9]'
                    : 'bg-[#009cd9] opacity-50 text-teal-200 pointer-events-none',
                ]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-4">
                  <path fill-rule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clip-rule="evenodd" />
                </svg>
                {{ btnText }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { signInUser } from "~/composables/useFirebase";
  import { serverTimestamp } from "firebase/firestore";
  definePageMeta({
    layout: false,
  });
  
  const loginErrorMsg = ref("");
  const emailInput = ref("");
  const passwordInput = ref("");
  const router = useRouter();
  const route = useRoute();
  
  const btnText = ref("Sign in");
  
  const firebaseUser = useFirebaseUser()
  
  const login = async () => {
    try {
      btnText.value = "Signing in...";
      let res = await signInUser(emailInput.value, passwordInput.value);
      if (res.user) {
        console.log(res.user);
        navigateTo("/admin");
      } else {
        loginErrorMsg.value = res;
        btnText.value = "Sign in";
        setTimeout(() => {
          loginErrorMsg.value = "";
        }, 3000);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  
  onMounted(() => {
    const userCookie = useCookie("userCookie");
    // console.log(userCookie)
    if (userCookie) {
      router.push("/admin");
    }
  });

  
  
  </script>
  
  <style>
  
  </style>