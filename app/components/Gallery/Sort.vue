<template>
  <Card class="px-5 gap-4">
    <h3 class="text-sm font-semibold">{{ $t('gallery.sort.title') }}</h3>

    <div class="space-y-3">
      <!-- Sort field -->
      <div class="space-y-1.5">
        <label class="text-xs text-muted-foreground">{{ $t('gallery.sort.field') }}</label>
        <Select :model-value="sort?.field" @update:model-value="updateField">
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ident">{{ $t('gallery.sort.ident') }}</SelectItem>
            <SelectItem value="createdAt">{{ $t('gallery.sort.createdAt') }}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Sort direction -->
      <div class="space-y-1.5">
        <label class="text-xs text-muted-foreground">{{ $t('gallery.sort.direction') }}</label>
        <Select :model-value="sort?.direction" @update:model-value="updateDirection">
          <SelectTrigger class="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{{ $t('gallery.sort.asc') }}</SelectItem>
            <SelectItem value="desc">{{ $t('gallery.sort.desc') }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GallerySort } from '~/types/types'

const props = withDefaults(
  defineProps<{
    sort?: GallerySort
  }>(),
  {
    sort: () => ({ field: 'createdAt', direction: 'desc' }),
  },
)

const emit = defineEmits<{
  'update:sort': [value: GallerySort]
}>()

function updateField(value: AcceptableValue) {
  if (typeof value === 'string') {
    emit('update:sort', { ...props.sort!, field: value as GallerySort['field'] })
  }
}

function updateDirection(value: AcceptableValue) {
  if (typeof value === 'string') {
    emit('update:sort', { ...props.sort!, direction: value as GallerySort['direction'] })
  }
}
</script>



