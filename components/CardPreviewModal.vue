<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      @click.self="emit('close')"
    >
      <div class="relative w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-3xl gufeng-panel text-neutral-100 shadow-2xl border border-amber-500/30 space-y-4 flex flex-col max-h-[95vh]">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 p-2 text-neutral-400 hover:text-amber-200 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="space-y-0.5 text-center flex-shrink-0">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 mb-1 border border-amber-400/30">
            <span class="text-sm">🖼️</span>
          </div>
          <h3 class="text-base font-serif font-bold text-amber-100 tracking-wide">3D 古风花笺画轴</h3>
          <p class="text-[11px] font-serif text-neutral-400">已为你绘制高清宣纸花笺画幅，长按或点击下载即可留存</p>
        </div>

        <!-- Poster Image Preview -->
        <div class="flex-1 min-h-0 overflow-y-auto rounded-2xl bg-black/60 border border-amber-500/25 flex items-center justify-center p-2">
          <img
            v-if="posterDataUrl"
            :src="posterDataUrl"
            alt="3D Flower Greeting Card Poster"
            class="max-h-[58vh] sm:max-h-[62vh] w-auto rounded-xl shadow-2xl object-contain border border-amber-500/20"
          />
          <div v-else class="py-16 text-xs text-amber-200/70 font-serif animate-pulse">
            正在研墨绘制高清花笺...
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 pt-1 flex-shrink-0">
          <button
            type="button"
            @click="handleDownload"
            class="flex-1 py-3 px-4 rounded-2xl gufeng-btn-gold font-serif font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.99]"
          >
            <span>📥</span>
            <span>保存高清花笺画轴</span>
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-neutral-300 font-serif text-xs transition-all"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { downloadImage } from '~/utils/cardPosterGenerator';

const props = defineProps<{
  isOpen: boolean;
  posterDataUrl: string;
  flowerName?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function handleDownload() {
  if (!props.posterDataUrl) return;
  const name = props.flowerName ? `3D古风花笺_${props.flowerName}.png` : '3D古风花笺.png';
  downloadImage(props.posterDataUrl, name);
}
</script>
