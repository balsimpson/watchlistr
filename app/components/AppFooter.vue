<template>
  <footer class="border-t border-default">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <span>Watchlistr</span>

      <nav class="flex items-center gap-1" aria-label="Legal navigation">
        <UButton to="/terms" color="neutral" variant="link" size="xs">Terms</UButton>
        <UButton to="/privacy" color="neutral" variant="link" size="xs">Privacy</UButton>
      </nav>
    </div>
  </footer>
</template>
