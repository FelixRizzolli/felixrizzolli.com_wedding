<template>
  <header class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) p-2">
    <h1 class="text-xl font-medium flex items-center gap-3">
      <!-- Use the MyIcon wrapper which resolves the generated ILogo component by name -->
      <ILogo class="h-8 w-auto" role="img" aria-label="Elisabeth & Felix" />
      <span>Elisabeth & Felix</span>
    </h1>
  </header>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">

</style>