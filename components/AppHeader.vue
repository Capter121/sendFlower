<template>
  <header class="w-full flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 z-20">
    <!-- Brand / Title with Chinese Seal Stamp -->
    <NuxtLink to="/" class="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
      <!-- Cinnabar Red Seal Stamp -->
      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gufeng-cinnabar/90 flex items-center justify-center shadow-lg shadow-gufeng-cinnabar/30 group-hover:scale-105 transition-transform border border-amber-300/40">
        <span class="text-[11px] sm:text-xs font-brush text-amber-100 font-bold">花笺</span>
      </div>
      <div class="flex flex-col">
        <h1 class="text-xs sm:text-base font-serif font-semibold tracking-widest text-amber-100/90 group-hover:text-amber-200 transition-colors flex items-center gap-1">
          <span>花笺记</span>
          <span class="text-[9px] sm:text-[10px] font-serif px-1 sm:px-1.5 py-0.2 rounded border border-amber-500/40 text-amber-300/80 bg-amber-500/10">3D 东方繁花</span>
        </h1>
        <span class="text-[8px] sm:text-[9px] font-serif text-neutral-400/80 tracking-widest hidden sm:inline">云中谁寄锦书来 · 岁岁常相见</span>
      </div>
    </NuxtLink>

    <!-- Header Actions (BGM Player + Mood + Info) -->
    <div class="flex items-center gap-1.5 sm:gap-2">
      <!-- Background Music Player Widget -->
      <BgmPlayer />

      <!-- Mood Matcher Button (寄情题笺) -->
      <button
        v-if="showMoodButton"
        type="button"
        @click="emit('open-mood')"
        class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-serif text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 transition-all flex items-center gap-1 shadow-sm"
      >
        <span>🏮</span>
        <span class="hidden sm:inline font-medium">寄情题笺</span>
      </button>

      <!-- About Button (题跋说明) -->
      <button
        type="button"
        @click="emit('open-info')"
        class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-serif tracking-wider text-neutral-300 hover:text-amber-200 gufeng-pill hover:bg-white/10 transition-all flex items-center gap-1 border border-white/10"
      >
        <span>📜</span>
        <span class="hidden sm:inline">题跋</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
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
</script>
