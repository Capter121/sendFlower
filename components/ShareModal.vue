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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      @click.self="emit('close')"
    >
      <div class="relative w-full max-w-md p-6 sm:p-7 rounded-3xl gufeng-panel text-neutral-100 shadow-2xl border border-amber-500/30 space-y-5">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-neutral-400 hover:text-amber-200 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="space-y-1 text-center">
          <div class="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-500/20 mb-1 border border-amber-400/30">
            <span class="text-xl">🏮</span>
          </div>
          <h3 class="text-lg font-serif font-bold text-amber-100 tracking-wide">花笺已封缄 · 传情达意</h3>
          <p class="text-xs font-serif text-neutral-400">所有花品与题词已加密压入链接，复制赠与知己即可</p>
        </div>

        <!-- URL Box -->
        <div class="p-3 rounded-2xl bg-black/50 border border-amber-500/20 space-y-1.5">
          <div class="text-[9px] font-mono text-amber-300/80 uppercase tracking-widest">✦ 专属花笺密符 (Shareable URL) ✦</div>
          <div class="text-xs text-amber-100/90 font-mono break-all max-h-20 overflow-y-auto select-all leading-relaxed p-1">
            {{ shareUrl }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-1">
          <!-- 1. Copy URL -->
          <button
            type="button"
            @click="copyUrl"
            class="w-full py-3 px-4 rounded-2xl gufeng-btn-gold text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.99]"
          >
            <span>📜</span>
            <span>一键复制花笺链接</span>
          </button>

          <!-- 2. Generate Card Poster -->
          <button
            type="button"
            @click="emit('generate-poster')"
            class="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-red-600/30 via-amber-600/30 to-red-600/30 hover:from-red-600/40 hover:to-amber-600/40 text-amber-200 text-xs font-serif font-medium tracking-wider transition-all flex items-center justify-center gap-2 border border-red-500/40"
          >
            <span>🖼️ 绘制/下载古风花笺画轴海报</span>
          </button>

          <!-- 3. Preview Link in New Tab -->
          <a
            :href="shareUrl"
            target="_blank"
            class="w-full py-2 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-200 text-xs font-serif tracking-wider transition-all flex items-center justify-center gap-2 border border-white/5"
          >
            <span>另启画卷预览效果 ↗</span>
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
