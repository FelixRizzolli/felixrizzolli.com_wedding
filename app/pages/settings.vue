<template>
  <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6">
    <h1 class="mb-8 text-2xl font-semibold tracking-tight">
      {{ t('settings.title') }}
    </h1>

    <div class="space-y-6">

      <!-- Language -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('settings.language.title') }}</CardTitle>
          <CardDescription>{{ t('settings.language.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select :model-value="locale" @update:model-value="setLocale($event as 'de' | 'it' | 'en')">
            <SelectTrigger class="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="loc in availableLocales"
                :key="loc.code"
                :value="loc.code"
              >
                {{ loc.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <!-- Theme -->
      <Card>
        <CardHeader>
          <CardTitle>{{ t('settings.theme.title') }}</CardTitle>
          <CardDescription>{{ t('settings.theme.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="option in themeOptions"
              :key="option.value"
              type="button"
              :class="[
                'flex flex-col items-center gap-2.5 rounded-lg border p-4 text-sm font-medium transition-all hover:bg-accent',
                preference === option.value
                  ? 'border-primary bg-accent text-accent-foreground shadow-sm'
                  : 'border-border text-muted-foreground',
              ]"
              @click="setTheme(option.value)"
            >
              <component :is="option.icon" class="size-5" />
              {{ option.label }}
            </button>
          </div>
        </CardContent>
      </Card>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Monitor, Sun, Moon } from '@lucide/vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useTheme, type ThemeMode } from '~/composables/useTheme'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

useHead({ title: 'Settings' })

const { t, locale, setLocale } = useI18n()
const { preference, setTheme } = useTheme()

const availableLocales = [
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
]

const themeOptions = computed<Array<{ value: ThemeMode; label: string; icon: unknown }>>(() => [
  { value: 'auto', label: t('settings.theme.system'), icon: Monitor },
  { value: 'light', label: t('settings.theme.light'), icon: Sun },
  { value: 'dark', label: t('settings.theme.dark'), icon: Moon },
])
</script>


