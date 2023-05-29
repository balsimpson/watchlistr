<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-b from-stone-900 via-gray-800 to-gray-900">
    <AppNav />
    <div class="flex-grow">
      <slot/>

    </div>
    <AppFooter />
  </div>
</template>
