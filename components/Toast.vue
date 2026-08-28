<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div
      v-if="show"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-neutral-900/90 text-neutral-100 text-sm font-medium shadow-2xl border border-white/10 backdrop-blur-md pointer-events-none"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  message: string;
}>();
</script>
