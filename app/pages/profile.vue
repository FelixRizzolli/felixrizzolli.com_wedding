<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
    <h1 class="mb-8 text-2xl font-semibold tracking-tight">
      {{ t('profile.title') }}
    </h1>

    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center gap-5">
          <Avatar :fallback="avatarFallback" class="size-16 text-xl" />
          <div class="flex flex-col gap-0.5">
            <p class="text-lg font-semibold">{{ user?.username }}</p>
            <p class="text-sm text-muted-foreground">{{ t('profile.loggedInAs') }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Avatar } from '~/components/ui/avatar'
import { Card, CardContent } from '~/components/ui/card'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({ title: 'Profile' })

const { t } = useI18n()
const { user } = useAuth()

const avatarFallback = computed(() => {
  const name = user.value?.username ?? ''
  return name.slice(0, 2).toUpperCase() || '??'
})
</script>

<style scoped lang="scss"></style>
