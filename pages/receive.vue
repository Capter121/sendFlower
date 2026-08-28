<template>
  <div class="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between font-sans select-none">
    <!-- 1. Classical Ancient Envelope Opening Ceremony (Unwrap Ritual) -->
    <UnwrapRitual
      :recipient="cardPayload.r"
      :sender="cardPayload.s"
      @unwrapped="onUnwrapComplete"
    />

    <!-- 2. 3D Realistic Flower Model Fullscreen Canvas (Transparent over bg.jpg) -->
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
      <NuxtLink to="/" class="flex items-center gap-2 text-xs font-serif tracking-widest text-amber-200/80 hover:text-amber-100 transition-colors group">
        <span class="text-xs group-hover:rotate-45 transition-transform text-amber-300">✦</span>
        <span>花笺记 · 3D 东方繁花</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <!-- Sound Toggle -->
        <button
          type="button"
          @click="toggleSound"
          :title="isMuted ? '开启空灵风铃音效' : '静音'"
          class="w-8 h-8 rounded-xl text-xs text-amber-200 gufeng-pill hover:bg-white/10 transition-all flex items-center justify-center border border-amber-500/30"
        >
          <span>{{ isMuted ? '🔕' : '🎐' }}</span>
        </button>

        <NuxtLink
          to="/"
          class="px-3.5 py-1.5 rounded-xl text-xs font-serif font-medium text-amber-100 gufeng-pill hover:bg-amber-500/20 transition-all flex items-center gap-1.5 border border-amber-500/30 shadow-sm"
        >
          <span>🌸 我亦要赠花</span>
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
          class="gufeng-panel p-5 sm:p-7 rounded-3xl space-y-4 pointer-events-auto text-neutral-100 shadow-2xl border border-amber-500/30 max-h-[calc(100dvh-5.5rem)] flex flex-col"
        >
          <!-- Card Header / Flower Badge & Recipient -->
          <div class="space-y-1 flex-shrink-0">
            <div class="flex items-center justify-between text-xs">
              <span class="font-serif tracking-widest text-amber-400/80">✦ 东方花笺 · 亲启 ✦</span>
              <span
                class="px-2.5 py-0.5 rounded-md text-[10px] font-serif border"
                :style="{
                  borderColor: modelInfo.accentColor + '60',
                  color: modelInfo.accentColor,
                  backgroundColor: modelInfo.accentColor + '18'
                }"
              >
                {{ modelInfo.name }} · {{ modelInfo.categoryLabel }}
              </span>
            </div>

            <!-- Recipient name if present -->
            <h2 v-if="cardPayload.r" class="text-xl font-serif font-bold text-amber-100 pt-1">
              致 · {{ cardPayload.r }} 雅鉴：
            </h2>
          </div>

          <!-- Main Message (Scrollable if long) -->
          <div class="flex-1 overflow-y-auto min-h-0 py-1 pr-1 custom-scroll">
            <p class="font-serif text-sm sm:text-base text-amber-100/90 leading-relaxed tracking-wide font-normal">
              {{ displayMessage }}
            </p>
          </div>

          <!-- Card Footer & Sender -->
          <div class="flex items-center justify-between pt-2 border-t border-amber-500/15 text-xs text-neutral-400 flex-shrink-0">
            <span class="font-serif italic text-amber-200/60 text-[11px] truncate max-w-[50%]">
              “{{ modelInfo.tagline }}”
            </span>
            <span v-if="cardPayload.s" class="font-serif text-amber-200 font-medium">
              落款 · {{ cardPayload.s }}
            </span>
          </div>

          <!-- Actions: Download Card Poster & Send Flower -->
          <div class="space-y-2 pt-1 flex-shrink-0">
            <!-- 🖼️ Download / Save Poster Button -->
            <button
              type="button"
              @click="onOpenCardPoster"
              :disabled="isGeneratingPoster"
              class="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-red-600/30 via-amber-600/30 to-red-600/30 hover:from-red-600/40 hover:to-amber-600/40 text-amber-200 font-serif font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-2 border border-red-500/40 active:scale-[0.99]"
            >
              <span>🖼️</span>
              <span>{{ isGeneratingPoster ? '正在研墨绘制花笺...' : '保存 / 下载 3D 古风花笺画轴 (含扫码印信)' }}</span>
            </button>

            <!-- Send Your Own -->
            <NuxtLink
              to="/"
              class="w-full py-2.5 px-5 rounded-2xl gufeng-btn-gold text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.99] group"
            >
              <span>🌸</span>
              <span>我亦要寄一束东方繁花</span>
              <span class="opacity-70">→</span>
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
  background: rgba(226, 156, 54, 0.3);
  border-radius: 9999px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(226, 156, 54, 0.6);
}
</style>
