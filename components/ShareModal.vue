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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      @click.self="emit('close')"
    >
      <div class="relative w-full max-w-md p-6 sm:p-7 rounded-3xl glass-panel text-neutral-100 shadow-2xl border border-white/10 space-y-5">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="space-y-1 text-center">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 mb-1">
            <span class="text-lg">✨</span>
          </div>
          <h3 class="text-lg font-serif text-white tracking-wide">专属数字花束已生成</h3>
          <p class="text-xs text-neutral-400">数据已压缩进专属链接中，复制并发送给对方即可</p>
        </div>

        <!-- URL Box -->
        <div class="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
          <div class="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Shareable URL</div>
          <div class="text-xs text-neutral-300 font-mono break-all max-h-20 overflow-y-auto select-all leading-relaxed p-1">
            {{ shareUrl }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-1">
          <!-- 1. Copy URL -->
          <button
            type="button"
            @click="copyUrl"
            class="w-full py-3 px-4 rounded-2xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 active:scale-[0.99]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>一键复制专属链接</span>
          </button>

          <!-- 2. Generate Card Poster -->
          <button
            type="button"
            @click="emit('generate-poster')"
            class="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-200 text-xs font-medium tracking-wider transition-all flex items-center justify-center gap-2 border border-amber-500/30"
          >
            <span>🖼️ 下载/生成专属贺卡海报 (含二维码)</span>
          </button>

          <!-- 3. Preview Link in New Tab -->
          <a
            :href="shareUrl"
            target="_blank"
            class="w-full py-2 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 text-xs tracking-wider transition-all flex items-center justify-center gap-2 border border-white/5"
          >
            <span>在新窗口预览效果 ↗</span>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  shareUrl: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'copied'): void;
  (e: 'generate-poster'): void;
}>();

async function copyUrl() {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.shareUrl);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = props.shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    emit('copied');
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
}
</script>
