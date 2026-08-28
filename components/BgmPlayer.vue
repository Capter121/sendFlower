<template>
  <div class="relative flex items-center">
    <!-- Mini Collapsed Widget / Rotating Music Jade Seal -->
    <div
      class="flex items-center gap-2 px-2.5 py-1 rounded-full gufeng-panel border border-amber-500/30 text-amber-200 text-xs shadow-lg transition-all"
    >
      <!-- Rotating Disc Icon -->
      <button
        type="button"
        @click="toggleBgmPlay"
        :title="isBgmPlaying ? '暂停背景音乐' : '播放背景音乐'"
        class="relative w-6 h-6 rounded-full flex items-center justify-center bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:scale-105 active:scale-95 transition-transform"
      >
        <span
          class="text-xs inline-block"
          :class="isBgmPlaying ? 'animate-spin-slow' : 'opacity-60'"
        >
          🎵
        </span>
      </button>

      <!-- Current Song Title Marquee / Info -->
      <div
        class="max-w-[110px] sm:max-w-[160px] overflow-hidden whitespace-nowrap text-left cursor-pointer"
        @click="toggleBgmPlay"
        :title="currentBgmTrack ? `当前播放：${currentBgmTrack.title}` : '点击播放背景音乐'"
      >
        <div
          v-if="currentBgmTrack"
          class="font-serif text-[11px] text-amber-100/90 truncate flex items-center gap-1"
        >
          <span v-if="isBgmPlaying" class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{{ currentBgmTrack.title }}</span>
        </div>
        <div v-else class="font-serif text-[11px] text-neutral-400">
          背景音乐 · 待启
        </div>
      </div>

      <!-- Quick Next Track Button (切歌) -->
      <button
        type="button"
        @click="playNextBgmTrack"
        title="随机切换下一首曲目"
        class="p-1 rounded-full text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/20 transition-all active:scale-90"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {
  isBgmPlaying,
  currentBgmTrack,
  initBgmPlayer,
  toggleBgmPlay,
  playNextBgmTrack
} from '~/utils/bgmPlayer';

onMounted(() => {
  initBgmPlayer();
});
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
