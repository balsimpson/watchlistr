<template>
  <div class="flex flex-col min-h-screen bg-stone-800">
    <AppNav />
    <div class="flex-grow">
      <slot/>

    </div>
    <AppFooter />
  </div>
</template>
