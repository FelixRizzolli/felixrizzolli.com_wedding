<template>
  <component
    v-if="resolvedIcon"
    :is="resolvedIcon"
    v-bind="$attrs"
    :class="[filled ? 'filled' : '', $attrs.class]
  "
  />

  <!-- fallback slot if no icon found -->
  <slot v-else />
</template>

<script lang="ts" setup>
import { computed, resolveDynamicComponent } from 'vue'

interface MyIconProps {
  icon?: Record<string, unknown> | null
  name?: string | null
  filled?: boolean
}

const props = withDefaults(defineProps<MyIconProps>(), {
  filled: false,
  icon: null,
  name: null,
})

function toPascalCase(s: string) {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

const resolvedIcon = computed(() => {
  if (props.icon)
    return props.icon

  if (props.name) {
    // nuxt-svgo prefixes generated components with `I` (config: componentPrefix: 'i')
    // Build the component name (ILogo for name='logo', IMyLogo for 'my-logo')
    const compName = 'I' + toPascalCase(props.name)
    return resolveDynamicComponent(compName)
  }

  return null
})
</script>

<style scoped>
  /* Set fill to currentColor for icons when the `filled` class is applied. */
  .filled,
  :deep(.filled) {
    fill: currentColor;
  }
</style>
