<template>
  <div class="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between font-sans select-none">
    <!-- 3D Realistic Flower Model Canvas with transparent background over bg.jpg -->
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

    <!-- Main Content: Classical Gu Feng Floating Panel with Smooth Show/Hide Transition -->
    <main class="relative z-10 w-full max-w-xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5 flex-1 flex flex-col justify-end pointer-events-none min-h-0">
      <!-- 1. Collapsible Control Panel -->
      <Transition
        enter-active-class="transition duration-400 ease-out"
        enter-from-class="opacity-0 translate-y-12 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-12 scale-95"
      >
        <div
          v-if="isPanelVisible"
          class="gufeng-panel p-4 sm:p-5 rounded-3xl pointer-events-auto shadow-2xl transition-all flex flex-col max-h-[calc(100dvh-5.2rem)]"
        >
          <!-- 1. Flower Info Header (Fixed Top) -->
          <div class="flex-shrink-0 flex items-center justify-between pb-2 border-b border-amber-500/20">
            <div class="space-y-0.5">
              <div class="flex items-center gap-2">
                <span class="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-200 font-serif">
                  {{ activeModel.categoryLabel }}
                </span>
                <span class="text-[10px] font-serif tracking-widest text-amber-400/70">✦ 东方雅卉 ✦</span>
              </div>
              <h2 class="text-lg font-serif font-bold text-amber-100 flex items-center gap-2 pt-0.5">
                <span>{{ activeModel.name }}</span>
                <span class="text-xs text-amber-200/60 font-serif font-normal italic truncate max-w-[140px] sm:max-w-[200px]">
                  “{{ activeModel.tagline }}”
                </span>
              </h2>
            </div>

            <!-- Quick Action Buttons in Header -->
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <!-- Mood Matcher Trigger (寄情) -->
              <button
                type="button"
                @click="isMoodOpen = true"
                title="寄情题笺与花签"
                class="px-2 py-1.5 rounded-xl text-xs text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span>🏮</span>
                <span class="font-serif font-medium text-[11px] hidden sm:inline">寄情</span>
              </button>

              <!-- Quick Random Button (摇签) -->
              <button
                type="button"
                @click="pickRandomFlower"
                title="随机采撷一束花"
                class="px-2 py-1.5 rounded-xl text-xs text-amber-100 bg-red-900/30 hover:bg-red-900/50 border border-red-500/30 transition-all flex items-center gap-1 shadow-sm active:scale-95 group"
              >
                <span class="text-xs group-hover:rotate-45 transition-transform">🎲</span>
                <span class="font-serif font-medium text-[11px] hidden sm:inline">摇签</span>
              </button>

              <!-- Hide Panel Button (收起面板 / 纯赏花) -->
              <button
                type="button"
                @click="isPanelVisible = false"
                title="收起面板，全屏沉浸纯享赏花"
                class="px-2.5 py-1.5 rounded-xl text-xs font-serif text-amber-200 bg-black/40 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1 active:scale-95"
              >
                <span>👁️</span>
                <span class="font-serif text-[11px]">收起</span>
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
          <div class="flex-shrink-0 pt-2.5 border-t border-amber-500/20">
            <button
              type="button"
              @click="onGenerateShareUrl"
              class="w-full py-3 px-5 rounded-2xl gufeng-btn-gold text-xs font-serif font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-xl active:scale-[0.99] group"
            >
              <span>📜</span>
              <span>卷轴封缄 · 生成 3D 花笺链接</span>
              <span class="opacity-70">→</span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- 2. Floating Expand Trigger Button when Panel is Hidden (展开面板悬浮钮) -->
      <Transition
        enter-active-class="transition duration-300 ease-out delay-150"
        enter-from-class="opacity-0 translate-y-6 scale-90"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div v-if="!isPanelVisible" class="flex items-center justify-center pointer-events-auto pb-3">
          <button
            type="button"
            @click="isPanelVisible = true"
            class="px-6 py-3 rounded-full gufeng-panel text-xs font-serif font-bold text-amber-200 border border-amber-500/50 shadow-2xl hover:bg-amber-500/25 transition-all flex items-center gap-2.5 group active:scale-95"
          >
            <span class="text-sm group-hover:rotate-12 transition-transform">🌸</span>
            <span class="tracking-wider">展开选花题词面板</span>
            <span class="text-[10px] text-amber-400">▲</span>
          </button>
        </div>
      </Transition>
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
const isPanelVisible = ref(true); // 👈 掌控面板隐藏与显示状态
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
  toastMessage.value = `已随机为你采撷「${randomModel.name}」✨`;
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
  toastMessage.value = `已智能选配「${matchedFlower.name}」与意境题词 🏮`;
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
  toastMessage.value = '花笺密符已复制到剪贴板 📜';
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
  background: rgba(226, 156, 54, 0.3);
  border-radius: 9999px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(226, 156, 54, 0.6);
}
</style>
