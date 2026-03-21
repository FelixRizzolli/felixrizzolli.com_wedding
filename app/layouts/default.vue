<template>
  <div class="flex min-h-svh flex-col">
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped></style>