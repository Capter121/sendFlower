<template>
  <div class="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between bg-abyss-950 font-sans select-none">
    <!-- 1. Unwrapping Gift Seal Ritual Overlay -->
    <UnwrapRitual
      :recipient="cardPayload.r"
      :sender="cardPayload.s"
      @unwrapped="onUnwrapComplete"
    />

    <!-- 2. 3D Realistic Flower Model Fullscreen Canvas -->
    <div class="absolute inset-0 z-0">
      <FlowerModel3D
        ref="flowerModelRef"
        :model-id="cardPayload.mid"
        :auto-rotate="true"
        :interactive="true"
        @model-loaded="onModelLoaded"
      />
    </div>

    <!-- 3. Header Overlay -->
    <header class="w-full flex items-center justify-between px-4 sm:px-6 py-4 z-20 flex-shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-white transition-colors group">
        <span class="text-xs group-hover:rotate-45 transition-transform">✦</span>
        <span>DIGITAL BLOOM · 3D</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <!-- Sound Toggle -->
        <button
          type="button"
          @click="toggleSound"
          title="音效开关"
          class="w-8 h-8 rounded-full text-xs text-neutral-300 glass-pill hover:bg-white/15 transition-all flex items-center justify-center"
        >
          <span>{{ isMuted ? '🔇' : '🔔' }}</span>
        </button>

        <NuxtLink
          to="/"
          class="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-200 glass-pill hover:bg-white/15 transition-all flex items-center gap-1.5"
        >
          <span>🌸 我也要送花</span>
        </NuxtLink>
      </div>
    </header>

    <!-- 4. Receiver Greeting Card Overlay (Appears after unwrap) -->
    <main class="relative z-10 w-full max-w-lg mx-auto px-4 pb-4 sm:pb-8 flex-1 flex flex-col justify-end pointer-events-none min-h-0">
      <Transition
        enter-active-class="transition duration-1000 ease-out delay-200"
        enter-from-class="opacity-0 translate-y-8 blur-sm scale-95"
        enter-to-class="opacity-100 translate-y-0 blur-0 scale-100"
      >
        <div
          v-if="isCardVisible"
          class="glass-panel p-5 sm:p-7 rounded-3xl space-y-4 pointer-events-auto text-neutral-100 shadow-2xl border border-white/10 max-h-[calc(100dvh-5.5rem)] flex flex-col"
        >
          <!-- Card Header / Flower Badge & Recipient -->
          <div class="space-y-1 flex-shrink-0">
            <div class="flex items-center justify-between text-xs">
              <span class="font-mono uppercase tracking-widest text-neutral-400">GREETING CARD</span>
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-mono border"
                :style="{
                  borderColor: modelInfo.accentColor + '50',
                  color: modelInfo.accentColor,
                  backgroundColor: modelInfo.accentColor + '15'
                }"
              >
                {{ modelInfo.name }} · {{ modelInfo.categoryLabel }}
              </span>
            </div>

            <!-- Recipient name if present -->
            <h2 v-if="cardPayload.r" class="text-lg font-serif font-light text-white pt-1">
              致 {{ cardPayload.r }}：
            </h2>
          </div>

          <!-- Main Message (Scrollable if long) -->
          <div class="flex-1 overflow-y-auto min-h-0 py-1 pr-1 custom-scroll">
            <p class="font-serif text-sm sm:text-base text-neutral-200 leading-relaxed tracking-wide font-light">
              {{ displayMessage }}
            </p>
          </div>

          <!-- Card Footer & Sender -->
          <div class="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-neutral-400 flex-shrink-0">
            <span class="font-serif italic text-neutral-500 text-[11px] truncate max-w-[50%]">
              “{{ modelInfo.tagline }}”
            </span>
            <span v-if="cardPayload.s" class="font-serif text-neutral-300">
              —— {{ cardPayload.s }}
            </span>
          </div>

          <!-- Actions: Download Card Poster & Send Flower -->
          <div class="space-y-2 pt-1 flex-shrink-0">
            <!-- 🖼️ Download / Save Poster Button -->
            <button
              type="button"
              @click="onOpenCardPoster"
              :disabled="isGeneratingPoster"
              class="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-200 font-medium text-xs tracking-wider transition-all flex items-center justify-center gap-2 border border-amber-500/30 active:scale-[0.99]"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{{ isGeneratingPoster ? '正在合成高清贺卡...' : '保存 / 下载 3D 贺卡图片 (含二维码)' }}</span>
            </button>

            <!-- Send Your Own -->
            <NuxtLink
              to="/"
              class="w-full py-2.5 px-5 rounded-2xl bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-[0.99] group"
            >
              <span class="text-sm">🌸</span>
              <span>我也要发送一束花</span>
              <span class="font-mono opacity-60">→</span>
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Card Poster Modal -->
    <CardPreviewModal
      :is-open="isCardPosterOpen"
      :poster-data-url="posterDataUrl"
      :flower-name="modelInfo.name"
      @close="isCardPosterOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { decodeCardData, type FlowerCardPayload } from '~/utils/cardCodec';
import { getFlowerModelById, DEFAULT_MODEL_ID, type FlowerModelInfo } from '~/constants/models';
import { generateCardPoster } from '~/utils/cardPosterGenerator';
import { isMuted, playPopSound } from '~/utils/audioSynth';

const route = useRoute();
const flowerModelRef = ref<any>(null);
const isCardVisible = ref(false);
const isCardPosterOpen = ref(false);
const isGeneratingPoster = ref(false);
const posterDataUrl = ref('');

const cardPayload = ref<FlowerCardPayload>({
  v: 2,
  mid: DEFAULT_MODEL_ID,
  c: Date.now()
});

const modelInfo = computed(() => getFlowerModelById(cardPayload.value.mid));

const displayMessage = computed(() => {
  if (cardPayload.value.m && cardPayload.value.m.trim()) {
    return cardPayload.value.m;
  }
  return modelInfo.value.defaultMessage;
});

function toggleSound() {
  isMuted.value = !isMuted.value;
  if (!isMuted.value) {
    playPopSound();
  }
}

function onModelLoaded(model: FlowerModelInfo) {
  // Model ready
}

function onUnwrapComplete() {
  setTimeout(() => {
    isCardVisible.value = true;
  }, 400);
}

async function onOpenCardPoster() {
  if (isGeneratingPoster.value) return;
  isGeneratingPoster.value = true;

  try {
    const snapshot = flowerModelRef.value?.captureSnapshot() || '';
    const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

    const dataUrl = await generateCardPoster({
      modelInfo: modelInfo.value,
      message: displayMessage.value,
      sender: cardPayload.value.s,
      recipient: cardPayload.value.r,
      shareUrl: fullUrl,
      snapshotDataUrl: snapshot
    });

    posterDataUrl.value = dataUrl;
    isCardPosterOpen.value = true;
  } catch (err) {
    console.error('Failed to generate card poster:', err);
  } finally {
    isGeneratingPoster.value = false;
  }
}

onMounted(() => {
  const queryData = (route.query.d as string) || (route.query.data as string);
  cardPayload.value = decodeCardData(queryData);
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
