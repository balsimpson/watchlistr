<template>
  <div v-if="isScrolled" class="fixed z-50 bottom-8 right-8">
    <button @click="scrollToTop"
      class="p-2 text-white bg-indigo-500 rounded-full shadow-md hover:bg-gray-700 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
      </svg>

    </button>
  </div>
</template>

<script setup>
const isScrolled = ref(false);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

</script>