<template>
  <header class="w-full flex items-center justify-between px-4 sm:px-6 py-4 z-20">
    <!-- Brand / Title with Chinese Seal Stamp -->
    <NuxtLink to="/" class="flex items-center gap-2.5 group">
      <!-- Cinnabar Red Seal Stamp -->
      <div class="w-8 h-8 rounded-lg bg-gufeng-cinnabar/90 flex items-center justify-center shadow-lg shadow-gufeng-cinnabar/30 group-hover:scale-105 transition-transform border border-amber-300/40">
        <span class="text-xs font-brush text-amber-100 font-bold">花笺</span>
      </div>
      <div class="flex flex-col">
        <h1 class="text-sm sm:text-base font-serif font-semibold tracking-widest text-amber-100/90 group-hover:text-amber-200 transition-colors flex items-center gap-1.5">
          <span>花笺记</span>
          <span class="text-[10px] font-serif px-1.5 py-0.2 rounded border border-amber-500/40 text-amber-300/80 bg-amber-500/10">3D 东方繁花</span>
        </h1>
        <span class="text-[9px] font-serif text-neutral-400/80 tracking-widest">云中谁寄锦书来 · 岁岁常相见</span>
      </div>
    </NuxtLink>

    <!-- Header Actions -->
    <div class="flex items-center gap-2">
      <!-- Sound Toggle Button -->
      <button
        type="button"
        @click="toggleSound"
        :title="isMuted ? '开启空灵风铃音效' : '静音'"
        class="w-8 h-8 rounded-xl text-xs text-amber-200 gufeng-pill hover:bg-white/10 transition-all flex items-center justify-center border border-amber-500/30"
      >
        <span>{{ isMuted ? '🔕' : '🎐' }}</span>
      </button>

      <!-- Mood Matcher Button (寄情题笺) -->
      <button
        v-if="showMoodButton"
        type="button"
        @click="emit('open-mood')"
        class="px-3 py-1.5 rounded-xl text-xs font-serif text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 transition-all flex items-center gap-1.5 shadow-sm"
      >
        <span>🏮</span>
        <span class="hidden sm:inline font-medium">寄情题笺</span>
      </button>

      <!-- About Button (题跋说明) -->
      <button
        type="button"
        @click="emit('open-info')"
        class="px-3 py-1.5 rounded-xl text-xs font-serif tracking-wider text-neutral-300 hover:text-amber-200 gufeng-pill hover:bg-white/10 transition-all flex items-center gap-1 border border-white/10"
      >
        <span>📜</span>
        <span class="hidden sm:inline">题跋</span>
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
