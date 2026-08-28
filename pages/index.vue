<template>
  <div class="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between bg-abyss-950 font-sans select-none">
    <!-- 3D Realistic Flower Model Canvas -->
    <div class="absolute inset-0 z-0">
      <FlowerModel3D
        ref="flowerModelRef"
        :model-id="selectedModelId"
        :auto-rotate="true"
        :interactive="true"
        @model-loaded="onModelLoaded"
      />
    </div>

    <!-- Header Overlay (Fixed) -->
    <AppHeader
      class="flex-shrink-0"
      :show-mood-button="true"
      @open-info="isInfoOpen = true"
      @open-mood="isMoodOpen = true"
    />

    <!-- Main Content: Floating Frosted Panel with Fixed Action Footer -->
    <main class="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5 flex-1 flex flex-col justify-end pointer-events-none min-h-0">
      <div class="glass-panel p-4 sm:p-5 rounded-3xl pointer-events-auto shadow-2xl transition-all border border-white/10 flex flex-col max-h-[calc(100dvh-5.2rem)]">
        <!-- 1. Flower Info Header (Fixed Top) -->
        <div class="flex-shrink-0 flex items-center justify-between pb-2 border-b border-white/10">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono">
                {{ activeModel.categoryLabel }}
              </span>
              <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-400">3D BLOOM</span>
            </div>
            <h2 class="text-lg font-serif text-white flex items-center gap-2 pt-0.5">
              <span>{{ activeModel.name }}</span>
              <span class="text-xs text-neutral-400 font-light italic truncate max-w-[150px] sm:max-w-[240px]">
                “{{ activeModel.tagline }}”
              </span>
            </h2>
          </div>

          <!-- Quick Action Buttons in Header -->
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <!-- Mood Matcher Trigger -->
            <button
              type="button"
              @click="isMoodOpen = true"
              title="情绪配花与花签"
              class="px-2.5 py-1.5 rounded-full text-xs text-purple-200 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all flex items-center gap-1 shadow-sm active:scale-95"
            >
              <span>🔮</span>
              <span class="font-sans font-medium text-[11px] hidden sm:inline">情绪配花</span>
            </button>

            <!-- Quick Random Button -->
            <button
              type="button"
              @click="pickRandomFlower"
              title="随机抽取一束花"
              class="px-2.5 py-1.5 rounded-full text-xs text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm active:scale-95 group"
            >
              <span class="text-sm group-hover:rotate-45 transition-transform">🎲</span>
              <span class="font-sans font-medium text-[11px]">换一束</span>
            </button>
          </div>
        </div>

        <!-- 2. Scrollable Body: Model Selector & Message Editor -->
        <div class="flex-1 overflow-y-auto min-h-0 py-2.5 space-y-3 pr-1 custom-scroll">
          <!-- 3D Model Selector -->
          <ModelSelector
            :model-value="selectedModelId"
            @select="onSelectModel"
          />

          <!-- Message & Signature Editor -->
          <MessageEditor
            ref="messageEditorRef"
            :theme-tagline="activeModel.tagline"
            :default-placeholder="activeModel.defaultMessage"
            @update="onUpdateMessageData"
          />
        </div>

        <!-- 3. Generate Link Action Button (Fixed Bottom & Always Visible) -->
        <div class="flex-shrink-0 pt-2.5 border-t border-white/10">
          <button
            type="button"
            @click="onGenerateShareUrl"
            class="w-full py-3 px-5 rounded-2xl bg-white text-black font-semibold text-xs tracking-widest uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-[0.99] group"
          >
            <span class="w-2 h-2 rounded-full bg-black group-hover:scale-125 transition-transform" />
            <span>生成专属 3D 花束贺卡链接</span>
            <span class="font-mono opacity-60">→</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Modals & Feedback -->
    <ShareModal
      :is-open="isShareOpen"
      :share-url="currentShareUrl"
      @close="isShareOpen = false"
      @copied="onCopySuccess"
      @generate-poster="onOpenSenderCardPoster"
    />

    <MoodMatcherModal
      :is-open="isMoodOpen"
      @close="isMoodOpen = false"
      @apply="onApplyMoodRecommendation"
    />

    <CardPreviewModal
      :is-open="isCardPosterOpen"
      :poster-data-url="posterDataUrl"
      :flower-name="activeModel.name"
      @close="isCardPosterOpen = false"
    />

    <InfoModal
      :is-open="isInfoOpen"
      @close="isInfoOpen = false"
    />

    <Toast
      :show="showToast"
      :message="toastMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DEFAULT_MODEL_ID, getFlowerModelById, getRandomFlowerModel, type FlowerModelInfo } from '~/constants/models';
import { generateShareUrl } from '~/utils/cardCodec';
import { generateCardPoster } from '~/utils/cardPosterGenerator';

const flowerModelRef = ref<any>(null);
const messageEditorRef = ref<any>(null);
const selectedModelId = ref(DEFAULT_MODEL_ID);
const isShareOpen = ref(false);
const isInfoOpen = ref(false);
const isMoodOpen = ref(false);
const isCardPosterOpen = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const currentShareUrl = ref('');
const posterDataUrl = ref('');

const activeModel = computed(() => getFlowerModelById(selectedModelId.value));

const cardData = ref<{
  message?: string;
  sender?: string;
  recipient?: string;
}>({});

function onSelectModel(modelId: string) {
  selectedModelId.value = modelId;
}

function pickRandomFlower() {
  const randomModel = getRandomFlowerModel(selectedModelId.value);
  selectedModelId.value = randomModel.id;
  toastMessage.value = `已随机为你挑选「${randomModel.name}」✨`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2200);
}

function onApplyMoodRecommendation(data: { modelId: string; message: string }) {
  selectedModelId.value = data.modelId;
  cardData.value.message = data.message;
  messageEditorRef.value?.setMessage(data.message);

  const matchedFlower = getFlowerModelById(data.modelId);
  toastMessage.value = `已智能选配「${matchedFlower.name}」与专属寄语 🔮`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2500);
}

function onModelLoaded(model: FlowerModelInfo) {
  // Model loaded callback
}

function onUpdateMessageData(data: { message?: string; sender?: string; recipient?: string }) {
  cardData.value = data;
}

function onGenerateShareUrl() {
  currentShareUrl.value = generateShareUrl({
    v: 2,
    mid: selectedModelId.value,
    m: cardData.value.message,
    s: cardData.value.sender,
    r: cardData.value.recipient,
    c: Date.now()
  });
  isShareOpen.value = true;
}

async function onOpenSenderCardPoster() {
  try {
    const snapshot = flowerModelRef.value?.captureSnapshot() || '';
    const url = currentShareUrl.value || generateShareUrl({
      v: 2,
      mid: selectedModelId.value,
      m: cardData.value.message,
      s: cardData.value.sender,
      r: cardData.value.recipient,
      c: Date.now()
    });

    const dataUrl = await generateCardPoster({
      modelInfo: activeModel.value,
      message: cardData.value.message || activeModel.value.defaultMessage,
      sender: cardData.value.sender,
      recipient: cardData.value.recipient,
      shareUrl: url,
      snapshotDataUrl: snapshot
    });

    posterDataUrl.value = dataUrl;
    isCardPosterOpen.value = true;
  } catch (err) {
    console.error('Failed to generate card poster on sender page:', err);
  }
}

function onCopySuccess() {
  toastMessage.value = '专属花束链接已复制到剪贴板 ✨';
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2800);
}
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
