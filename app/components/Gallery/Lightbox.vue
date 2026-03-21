<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="modelValue !== null"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
        @click.self="close"
      >
        <!-- Header: counter + close -->
        <div class="absolute inset-x-4 top-4 z-10 flex items-center justify-between">
          <span class="select-none text-sm tabular-nums text-white/70">
            {{ currentSlide + 1 }} / {{ images.length }}
          </span>
          <button
            class="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close lightbox"
            @click="close"
          >
            <XIcon class="size-5" />
          </button>
        </div>

        <!-- Carousel -->
        <Carousel
          class="w-full max-w-5xl px-14"
          :opts="{ startIndex: modelValue ?? 0, duration: 20 }"
          @init-api="onInitApi"
        >
          <CarouselContent class="ml-0">
            <CarouselItem
              v-for="image in images"
              :key="image.ident"
              class="flex items-center justify-center pl-0"
            >
              <img
                :src="image.cloudflareLink || image.onedriveLink"
                :alt="image.ident"
                class="max-h-[82vh] max-w-full select-none rounded-lg object-contain shadow-2xl"
                draggable="false"
              />
            </CarouselItem>
          </CarouselContent>

          <CarouselPrevious
            class="left-2 border-white/20 bg-white/10 text-white hover:bg-white/25 hover:text-white disabled:opacity-20"
          />
          <CarouselNext
            class="right-2 border-white/20 bg-white/10 text-white hover:bg-white/25 hover:text-white disabled:opacity-20"
          />
        </Carousel>

        <!-- Image title -->
        <div
          v-if="currentImage"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-4 py-1.5 text-sm tracking-wide text-white/80 backdrop-blur-sm"
        >
          {{ currentImage.ident }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { XIcon } from 'lucide-vue-next'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel'
import type { WeddingImage } from '~/types/types'

const props = defineProps<{
  images: WeddingImage[]
  /** Index of the open image, or null when closed */
  modelValue: number | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: null]
}>()

// ── Carousel API ───────────────────────────────────────────────────────────
const api = ref<CarouselApi | null>(null)
const currentSlide = ref(props.modelValue ?? 0)

function onInitApi(embla: CarouselApi) {
  if (!embla) return
  api.value = embla
  currentSlide.value = embla.selectedScrollSnap()
  embla.on('select', () => {
    currentSlide.value = embla!.selectedScrollSnap()
  })
}

const currentImage = computed<WeddingImage | null>(() => props.images[currentSlide.value] ?? null)

// ── Open / close ───────────────────────────────────────────────────────────
function close() {
  emit('update:modelValue', null)
}

// Lock body scroll while lightbox is open
watch(
  () => props.modelValue,
  (val) => {
    if (import.meta.client) {
      document.body.style.overflow = val !== null ? 'hidden' : ''
    }
  },
)

// ── Keyboard navigation ────────────────────────────────────────────────────
function handleKeydown(e: KeyboardEvent) {
  if (props.modelValue === null) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') api.value?.scrollPrev()
  if (e.key === 'ArrowRight') api.value?.scrollNext()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>

