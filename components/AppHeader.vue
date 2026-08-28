<template>
  <header class="w-full flex items-center justify-between px-4 sm:px-6 py-4 z-20">
    <!-- Brand / Title -->
    <NuxtLink to="/" class="flex items-center gap-2.5 group">
      <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500/80 to-purple-400/80 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
        <span class="text-xs">✦</span>
      </div>
      <div>
        <h1 class="text-sm font-serif tracking-widest uppercase text-neutral-200 group-hover:text-white transition-colors">
          Digital Bloom
        </h1>
      </div>
    </NuxtLink>

    <!-- Header Actions -->
    <div class="flex items-center gap-2">
      <!-- Sound Toggle Button -->
      <button
        type="button"
        @click="toggleSound"
        title="音效开关"
        class="w-8 h-8 rounded-full text-xs text-neutral-300 glass-pill hover:bg-white/15 transition-all flex items-center justify-center"
      >
        <span>{{ isMuted ? '🔇' : '🔔' }}</span>
      </button>

      <!-- Mood Matcher Button -->
      <button
        v-if="showMoodButton"
        type="button"
        @click="emit('open-mood')"
        class="px-3 py-1.5 rounded-full text-xs font-sans text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all flex items-center gap-1.5 shadow-sm"
      >
        <span>🔮</span>
        <span class="hidden sm:inline">情绪配花</span>
      </button>

      <!-- About Button -->
      <button
        type="button"
        @click="emit('open-info')"
        class="px-3 py-1.5 rounded-full text-xs font-mono tracking-wider text-neutral-400 hover:text-neutral-200 glass-pill hover:bg-white/10 transition-all flex items-center gap-1"
      >
        <span>ABOUT</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { isMuted, playPopSound } from '~/utils/audioSynth';

withDefaults(
  defineProps<{
    showMoodButton?: boolean;
  }>(),
  {
    showMoodButton: true
  }
);

const emit = defineEmits<{
  (e: 'open-info'): void;
  (e: 'open-mood'): void;
}>();

function toggleSound() {
  isMuted.value = !isMuted.value;
  if (!isMuted.value) {
    playPopSound();
  }
}
</script>
