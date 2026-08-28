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
      <div class="relative w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-3xl glass-panel text-neutral-100 shadow-2xl border border-white/10 space-y-4 flex flex-col max-h-[95vh]">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="space-y-0.5 text-center flex-shrink-0">
          <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 mb-1">
            <span class="text-sm">💌</span>
          </div>
          <h3 class="text-base font-serif text-white tracking-wide">专属 3D 繁花贺卡</h3>
          <p class="text-[11px] text-neutral-400">已为你合成高清贺卡海报，长按或点击下载即可保存</p>
        </div>

        <!-- Poster Image Preview -->
        <div class="flex-1 min-h-0 overflow-y-auto rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center p-2">
          <img
            v-if="posterDataUrl"
            :src="posterDataUrl"
            alt="3D Flower Greeting Card Poster"
            class="max-h-[58vh] sm:max-h-[62vh] w-auto rounded-xl shadow-2xl object-contain"
          />
          <div v-else class="py-16 text-xs text-neutral-400 animate-pulse font-mono">
            正在渲染高清贺卡...
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 pt-1 flex-shrink-0">
          <button
            type="button"
            @click="handleDownload"
            class="flex-1 py-3 px-4 rounded-2xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-[0.99]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>保存高清贺卡图片</span>
          </button>
          <button
            type="button"
            @click="emit('close')"
            class="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-neutral-300 text-xs transition-all"
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
  const name = props.flowerName ? `3D贺卡_${props.flowerName}.png` : 'DigitalBloom_Card.png';
  downloadImage(props.posterDataUrl, name);
}
</script>
