<template>
  <Pagination
    v-if="totalPages > 1"
    :total="totalPages"
    :items-per-page="1"
    :sibling-count="1"
    :page="currentPage"
    show-edges
    @update:page="$emit('page-change', $event)"
  >
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />

      <!-- Mobile: compact "3 / 12" indicator instead of all page buttons -->
      <span class="select-none px-3 text-sm tabular-nums text-muted-foreground sm:hidden">
        {{ currentPage }} / {{ totalPages }}
      </span>

      <!-- Desktop: numbered page buttons + ellipsis -->
      <template v-for="(item, idx) in items" :key="item.type === 'page' ? item.value : `ell-${idx}`">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === currentPage"
          class="hidden sm:flex"
        >
          {{ item.value }}
        </PaginationItem>
        <PaginationEllipsis
          v-else
          :index="idx"
          class="hidden sm:flex"
        />
      </template>

      <PaginationNext />
    </PaginationContent>
  </Pagination>
</template>

<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'

defineProps<{
  totalPages: number
  currentPage: number
}>()

defineEmits<{
  'page-change': [page: number]
}>()
</script>

