<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
    <div class="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

      <!-- Left: Logo + Brand -->
      <NuxtLink to="/" class="flex shrink-0 items-center gap-2.5 mr-6">
        <ILogo class="h-8 w-auto" role="img" :aria-label="t('title')" />
        <span class="hidden font-semibold tracking-tight sm:block">Elisabeth & Felix</span>
      </NuxtLink>

      <!-- Center: Navigation links -->
      <nav class="flex flex-1 items-center justify-center">
        <div class="flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            active-class="bg-accent text-accent-foreground"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </nav>

      <!-- Right: Profile avatar dropdown -->
      <div class="ml-6 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              class="rounded-full ring-offset-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :aria-label="t('nav.profile')"
            >
              <Avatar class="size-9 cursor-pointer">
                <!--
                <AvatarImage
                    v-if="src"
                    :src="src"
                    :alt="alt ?? ''"
                    class="aspect-square size-full"
                />
                -->
                <AvatarFallback
                    class="flex size-full items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase tracking-wide"
                >
                  {{ avatarFallback ?? '?' }}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-52">
            <DropdownMenuLabel>
              <div class="flex flex-col gap-0.5">
                <span class="font-semibold">{{ user?.username }}</span>
                <span class="text-xs font-normal text-muted-foreground">{{ t('profile.loggedInAs') }}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <NuxtLink to="/profile" class="flex w-full cursor-pointer items-center">
                <User class="mr-2 size-4" />
                {{ t('nav.profile') }}
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <NuxtLink to="/settings" class="flex w-full cursor-pointer items-center">
                <Settings class="mr-2 size-4" />
                {{ t('nav.settings') }}
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="cursor-pointer text-destructive focus:text-destructive"
              @click="handleLogout"
            >
              <LogOut class="mr-2 size-4" />
              {{ t('nav.logout') }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { User, Settings, LogOut } from '@lucide/vue'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()
const { t } = useI18n()

const navLinks = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/profile', label: t('nav.profile') },
])

const avatarFallback = computed(() => {
  const name = user.value?.username ?? ''
  return name.slice(0, 2).toUpperCase() || '??'
})

async function handleLogout() {
  logout()
  await navigateTo('/login')
}
</script>


<style scoped lang="scss"></style>
