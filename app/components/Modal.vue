<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="close"></div>
                <div class="relative z-10 mx-4 w-full max-w-md">
                    <button
                        @click="close"
                        aria-label="Close"
                        class="absolute -top-3 -right-3 z-20 rounded-full bg-white/90 p-1 shadow"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-gray-700"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                    <div class="rounded bg-white p-12 shadow-lg">
                        <slot />
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup lang="ts">
    const props = defineProps({ show: { type: Boolean, default: false } });
    const emit = defineEmits(['update:show']);
    function close() {
        emit('update:show', false);
    }
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.12s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
