<template>
  <div class="flex min-h-svh w-full">
    <div class="flex w-full items-center justify-center p-6 lg:w-1/2">
      <div class="w-full max-w-xs">
        <LayoutLoginForm
          :initial-username="initialUsername"
          :initial-token="initialToken"
        />
      </div>
    </div>
    <div class="relative hidden w-1/2 lg:block">
      <img
          alt="Authentication"
          class="absolute inset-0 h-full w-full object-cover"
          height="{1080}"
          :src="loginImage"
          width="{1920}"
      >
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'fullscreen',
})

const route = useRoute()

/**
 * Pre-fill the login form when the invitation link contains
 * ?username=...&token=... query parameters.
 */
const initialUsername = computed(() => {
  const val = route.query.username
  return typeof val === 'string' ? val : undefined
})

const initialToken = computed(() => {
  const val = route.query.token
  return typeof val === 'string' ? val : undefined
})

const loginImage = (
    "https://wedding-cdn.felixrizzolli.com/"
    + "91b9d01cf24adda663987a4418496f207fe638e08b5d9e147291e86c4d14999a.jpg"
)

</script>