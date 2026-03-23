<template>
  <footer class="border-t bg-background">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">

        <!-- Brand -->
        <NuxtLink to="/" class="flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100">
          <ILogo class="h-6 w-auto" role="img" aria-label="Elisabeth & Felix" />
          <span class="text-sm font-medium">Elisabeth & Felix</span>
        </NuxtLink>

        <!-- Copyright -->
        <p class="text-center text-xs text-muted-foreground">
          &copy; {{ year }} Elisabeth & Felix.
          <span class="hidden sm:inline">All rights reserved.</span>
        </p>

        <!-- GitHub -->
        <a
          href="https://github.com/FelixRizzolli/felixrizzolli.com_wedding"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 text-xs text-muted-foreground opacity-70 transition-opacity hover:opacity-100"
          aria-label="View source on GitHub"
        >
          <GitHubIcon class="size-4" />
          <span class="hidden sm:inline">Open Source</span>
        </a>

      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { GitHubIcon } from 'vue3-simple-icons'

const year = new Date().getFullYear()
</script>

<style scoped lang="scss"></style>
