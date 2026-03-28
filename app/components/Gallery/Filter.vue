<template>
  <Card class="px-5 gap-4">
    <!-- Header row -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">{{ $t('gallery.filter.title') }}</h3>
      <button
        v-if="selected.length > 0"
        class="text-xs text-muted-foreground transition-colors hover:text-foreground"
        @click="clearAll"
      >
        {{ $t('gallery.filter.clearAll') }}
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="pending" class="space-y-1">
      <div v-for="n in 2" :key="n">
        <Skeleton class="h-9 w-full rounded-md" />
      </div>
    </div>

    <!-- Error state -->
    <p v-else-if="error" class="text-xs text-muted-foreground">
      {{ $t('gallery.filter.error') }}
    </p>

    <!-- Category accordion (all closed by default — no defaultValue) -->
    <Accordion v-else type="multiple" class="w-full">
      <AccordionItem
        v-for="group in categoryGroups"
        :key="group.id"
        :value="group.id"
      >
        <AccordionTrigger
          class="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline hover:text-foreground"
        >
          {{ group.name }}
        </AccordionTrigger>
        <AccordionContent class="pb-3">
          <div class="space-y-2">
            <div
              v-for="category in categoriesForGroup(group.id)"
              :key="category.id"
              class="flex items-center gap-2.5"
            >
              <Checkbox
                :id="`cat-${category.id}`"
                :model-value="isSelected(category.id)"
                @update:model-value="(val) => toggleCategory(category.id, val === true)"
              />
              <label
                :for="`cat-${category.id}`"
                class="cursor-pointer select-none text-sm leading-none"
              >
                {{ category.name }}
              </label>
            </div>
            <p v-if="!categoriesForGroup(group.id).length" class="text-xs text-muted-foreground">
              {{ $t('gallery.filter.empty') }}
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <!-- No groups at all -->
      <p v-if="!categoryGroups.length" class="py-2 text-xs text-muted-foreground">
        {{ $t('gallery.filter.empty') }}
      </p>
    </Accordion>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { GraphQLClient } from 'graphql-request'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'
import type { WeddingCategory, WeddingCategoryGroup } from '~/types/types'

const FILTER_DATA_QUERY = `
  query FilterData($locale: LocaleInputType) {
    WeddingCategoryGroups(limit: 100, locale: $locale) {
      docs {
        id
        name
      }
    }
    WeddingCategories(limit: 100, locale: $locale) {
      docs {
        id
        name
        categoryGroup {
          id
        }
      }
    }
  }
`

interface FilterData {
  WeddingCategoryGroups: { docs: WeddingCategoryGroup[] }
  WeddingCategories: { docs: WeddingCategory[] }
}

const props = withDefaults(
  defineProps<{
    selectedCategories?: string[]
  }>(),
  {
    selectedCategories: () => [],
  },
)

const emit = defineEmits<{
  'update:selected-categories': [value: string[]]
}>()

const config = useRuntimeConfig()
const { token } = useAuth()
const { locale } = useI18n()

const categoryGroups = ref<WeddingCategoryGroup[]>([])
const categories = ref<WeddingCategory[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)

// Ensure the template always sees an array (avoids VLS complaining about
// possibly undefined optional prop). Use this for template checks.
const selected = computed(() => props.selectedCategories ?? [])

function categoriesForGroup(groupId: string): WeddingCategory[] {
  return categories.value.filter((c) => c.categoryGroup?.id === groupId)
}

function isSelected(categoryId: string): boolean {
  return (props.selectedCategories ?? []).includes(categoryId)
}

function toggleCategory(categoryId: string, checked: boolean): void {
  const next = [...(props.selectedCategories ?? [])]
  if (checked) {
    if (!next.includes(categoryId)) next.push(categoryId)
  } else {
    const idx = next.indexOf(categoryId)
    if (idx !== -1) next.splice(idx, 1)
  }
  emit('update:selected-categories', next)
  console.debug('[GalleryFilter] toggleCategory -> emitted', next, { categoryId, checked })
}

function clearAll(): void {
  emit('update:selected-categories', [])
  console.debug('[GalleryFilter] clearAll -> emitted empty selection')
}

async function fetchFilterData(): Promise<void> {
  pending.value = true
  error.value = null
  try {
    const headers: Record<string, string> = token.value
      ? { Authorization: `JWT ${token.value}` }
      : {}
    const client = new GraphQLClient(`${config.public.apiUrl}/api/graphql`, { headers })
    console.debug('[GalleryFilter] fetchFilterData: requesting', `${config.public.apiUrl}/api/graphql`, 'locale:', locale.value)
    const data = await client.request<FilterData>(FILTER_DATA_QUERY, { locale: locale.value })
    // Normalize IDs to strings so UI components that expect string `value` props
    // (AccordionItem, etc.) receive the correct type and comparisons with
    // `selectedCategories` (string[]) work as expected.
    categoryGroups.value = data.WeddingCategoryGroups.docs.map((g) => ({
      ...g,
      id: String(g.id),
    }))

    categories.value = data.WeddingCategories.docs.map((c) => ({
      ...c,
      id: String(c.id),
      categoryGroup: c.categoryGroup
        ? { ...c.categoryGroup, id: String(c.categoryGroup.id) }
        : c.categoryGroup,
    }))
    console.debug('[GalleryFilter] fetchFilterData: loaded', categoryGroups.value.length, 'groups and', categories.value.length, 'categories')
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  console.debug('[GalleryFilter] mounted: fetching filter data')
  fetchFilterData()
})

// Re-fetch translated names whenever the user switches language
watch(locale, () => {
  fetchFilterData()
})
</script>

<style scoped lang="scss">

</style>