<template>
  <Card class="px-5 gap-4">
    <!-- Header row -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">{{ $t('gallery.filter.title') }}</h3>
      <button
        v-if="hasSelection"
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

    <!-- Filter content -->
    <template v-else>
      <!-- ── Image categories (grouped by category group) ── -->
      <Accordion v-if="imageCategoryGroups.length" type="multiple" class="w-full">
        <AccordionItem
          v-for="group in imageCategoryGroups"
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
                v-for="category in imageCategoriesForGroup(group.id)"
                :key="category.id"
                class="flex items-center gap-2.5"
              >
                <Checkbox
                  :id="`cat-${category.id}`"
                  :model-value="isCategorySelected(category.id)"
                  @update:model-value="(val) => toggleCategory(category.id, val === true)"
                />
                <label
                  :for="`cat-${category.id}`"
                  class="cursor-pointer select-none text-sm leading-none"
                >
                  {{ category.name }}
                </label>
              </div>
              <p v-if="!imageCategoriesForGroup(group.id).length" class="text-xs text-muted-foreground">
                {{ $t('gallery.filter.empty') }}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <!-- ── Separator between sections ── -->
      <Separator v-if="imageCategoryGroups.length && peopleCategories.length" />

      <!-- ── People categories grouped by category group, each category expandable to show users ── -->
      <div v-if="peopleCategoryGroups.length" class="space-y-1">
        <Accordion type="multiple" class="w-full">
          <AccordionItem
            v-for="group in peopleCategoryGroups"
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
                <Accordion type="multiple" class="w-full">
                  <AccordionItem
                    v-for="category in peopleCategoriesForGroup(group.id)"
                    :key="category.id"
                    :value="category.id"
                  >
                    <AccordionTrigger
                      class="py-2 text-sm hover:no-underline hover:text-foreground"
                    >
                      <span class="flex items-center gap-2.5">
                        <span @click.stop @keydown.space.stop @keydown.enter.stop>
                          <Checkbox
                            :model-value="getPeopleCategoryState(category.id)"
                            @update:model-value="() => togglePeopleCategory(category.id)"
                          />
                        </span>
                        <span class="leading-none">{{ category.name }}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent class="pb-3">
                      <div class="space-y-2 pl-6">
                        <div
                          v-for="user in usersForCategory(category.id)"
                          :key="user.id"
                          class="flex items-center gap-2.5"
                        >
                          <Checkbox
                            :id="`user-${user.id}`"
                            :model-value="isUserSelected(user.id)"
                            @update:model-value="(val) => toggleUser(user.id, val === true)"
                          />
                          <label
                            :for="`user-${user.id}`"
                            class="cursor-pointer select-none text-sm leading-none"
                          >
                            {{ user.username }}
                          </label>
                        </div>
                        <p v-if="!usersForCategory(category.id).length" class="text-xs text-muted-foreground">
                          {{ $t('gallery.filter.noPeople') }}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <p v-if="!peopleCategoriesForGroup(group.id).length" class="text-xs text-muted-foreground">
                  {{ $t('gallery.filter.empty') }}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <!-- No filters at all -->
      <p v-if="!imageCategoryGroups.length && !peopleCategories.length" class="py-2 text-xs text-muted-foreground">
        {{ $t('gallery.filter.empty') }}
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { GraphQLClient } from 'graphql-request'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'
import type { WeddingCategory, WeddingCategoryGroup } from '~/types/types'

// Minimal WeddingUser type used by this component. The project also
// generates richer payload-types elsewhere; keep a local lightweight type
// here to avoid depending on the generated API types in the frontend bundle.
interface WeddingUser {
  id: string
  username: string
  categories?: { id: string }[]
}

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
        type
        categoryGroup {
          id
        }
      }
    }
    WeddingUsers(limit: 500) {
      docs {
        id
        username
        categories {
          id
        }
      }
    }
  }
`

interface FilterData {
  WeddingCategoryGroups: { docs: WeddingCategoryGroup[] }
  WeddingCategories: { docs: WeddingCategory[] }
  WeddingUsers: { docs: WeddingUser[] }
}

const props = withDefaults(
  defineProps<{
    selectedCategories?: string[]
    selectedUsers?: string[]
  }>(),
  {
    selectedCategories: () => [],
    selectedUsers: () => [],
  },
)

const emit = defineEmits<{
  'update:selected-categories': [value: string[]]
  'update:selected-users': [value: string[]]
}>()

const config = useRuntimeConfig()
const { token } = useAuth()
const { locale } = useI18n()

const categoryGroups = ref<WeddingCategoryGroup[]>([])
const categories = ref<WeddingCategory[]>([])
const weddingUsers = ref<WeddingUser[]>([])
const pending = ref(false)
const error = ref<Error | null>(null)

const hasSelection = computed(() =>
  (props.selectedCategories ?? []).length > 0 || (props.selectedUsers ?? []).length > 0,
)

const imageCategories = computed(() =>
  categories.value.filter((c) => c.type === 'images'),
)

const peopleCategories = computed(() =>
  categories.value.filter((c) => c.type === 'people'),
)

const imageCategoryGroups = computed(() => {
  const groupIds = new Set(imageCategories.value.map((c) => c.categoryGroup?.id))
  return categoryGroups.value.filter((g) => groupIds.has(g.id))
})

const peopleCategoryGroups = computed(() => {
  const groupIds = new Set(peopleCategories.value.map((c) => c.categoryGroup?.id))
  return categoryGroups.value.filter((g) => groupIds.has(g.id))
})

function imageCategoriesForGroup(groupId: string): WeddingCategory[] {
  return imageCategories.value.filter((c) => c.categoryGroup?.id === groupId)
}

function peopleCategoriesForGroup(groupId: string): WeddingCategory[] {
  return peopleCategories.value.filter((c) => c.categoryGroup?.id === groupId)
}

function isCategorySelected(categoryId: string): boolean {
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
}

function usersForCategory(categoryId: string): WeddingUser[] {
  return weddingUsers.value.filter((u) =>
    u.categories?.some((c) => c.id === categoryId) ?? false,
  )
}

function isUserSelected(userId: string): boolean {
  return (props.selectedUsers ?? []).includes(userId)
}

function getPeopleCategoryState(categoryId: string): boolean | 'indeterminate' {
  const users = usersForCategory(categoryId)
  if (!users.length) return false
  const selectedCount = users.filter((u) => (props.selectedUsers ?? []).includes(u.id)).length
  if (selectedCount === 0) return false
  if (selectedCount === users.length) return true
  return 'indeterminate'
}

function togglePeopleCategory(categoryId: string): void {
  const state = getPeopleCategoryState(categoryId)
  const users = usersForCategory(categoryId)
  const next = [...(props.selectedUsers ?? [])]

  if (state === true) {
    // Deselect all users in this category
    for (const user of users) {
      const idx = next.indexOf(user.id)
      if (idx !== -1) next.splice(idx, 1)
    }
  } else {
    // Select all users in this category (from unchecked or indeterminate)
    for (const user of users) {
      if (!next.includes(user.id)) next.push(user.id)
    }
  }

  emit('update:selected-users', next)
}

function toggleUser(userId: string, checked: boolean): void {
  const next = [...(props.selectedUsers ?? [])]
  if (checked) {
    if (!next.includes(userId)) next.push(userId)
  } else {
    const idx = next.indexOf(userId)
    if (idx !== -1) next.splice(idx, 1)
  }
  emit('update:selected-users', next)
}

function clearAll(): void {
  emit('update:selected-categories', [])
  emit('update:selected-users', [])
}

async function fetchFilterData(): Promise<void> {
  pending.value = true
  error.value = null
  try {
    const headers: Record<string, string> = token.value
      ? { Authorization: `JWT ${token.value}` }
      : {}
    const client = new GraphQLClient(`${config.public.apiUrl}/api/graphql`, { headers })
    const data = await client.request<FilterData>(FILTER_DATA_QUERY, { locale: locale.value })

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

    weddingUsers.value = data.WeddingUsers.docs.map((u) => ({
      ...u,
      id: String(u.id),
      categories: u.categories?.map((c) => ({ ...c, id: String(c.id) })),
    }))
  } catch (err) {
    error.value = err instanceof Error ? err : new Error(String(err))
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  fetchFilterData()
})

// Re-fetch translated names whenever the user switches language
watch(locale, () => {
  fetchFilterData()
})
</script>

<style scoped lang="scss">

</style>