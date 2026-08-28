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
      <div class="relative w-full max-w-lg p-5 sm:p-7 rounded-3xl gufeng-panel text-neutral-100 shadow-2xl border border-amber-500/30 space-y-5 max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-neutral-400 hover:text-amber-200 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Mode Switch Tabs -->
        <div class="flex items-center justify-center gap-2 pt-1">
          <div class="p-1 rounded-2xl bg-black/50 border border-amber-500/25 flex items-center gap-1">
            <button
              type="button"
              @click="activeTab = 'mood'"
              class="px-4 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1"
              :class="activeTab === 'mood' ? 'bg-amber-500/30 text-amber-200 font-semibold shadow-sm' : 'text-neutral-400 hover:text-amber-100'"
            >
              <span>🏮</span>
              <span>寄情题笺助手</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'oracle'"
              class="px-4 py-1.5 rounded-xl text-xs font-serif transition-all flex items-center gap-1"
              :class="activeTab === 'oracle' ? 'bg-amber-500/30 text-amber-200 font-semibold shadow-sm' : 'text-neutral-400 hover:text-amber-100'"
            >
              <span>🎴</span>
              <span>抽取今日花签</span>
            </button>
          </div>
        </div>

        <!-- 1. Mood Matcher Tab -->
        <div v-if="activeTab === 'mood'" class="space-y-3">
          <div class="text-center space-y-1">
            <h3 class="text-base font-serif font-bold text-amber-100">选择此刻欲托付之意境</h3>
            <p class="text-xs font-serif text-neutral-400">系统将为你依情选配相应花品与古典题词</p>
          </div>

          <div class="grid grid-cols-2 gap-2.5 pt-2">
            <button
              v-for="mood in moodList"
              :key="mood.id"
              type="button"
              @click="selectMood(mood)"
              class="p-3.5 rounded-2xl bg-black/40 hover:bg-black/60 border border-amber-500/20 hover:border-amber-400/50 transition-all text-left space-y-1.5 group active:scale-[0.98]"
            >
              <div class="flex items-center justify-between">
                <span class="text-lg">{{ mood.emoji }}</span>
                <span class="text-[10px] font-serif text-amber-300/80 group-hover:text-amber-200">
                  {{ mood.recommendFlowerName }}
                </span>
              </div>
              <div class="font-serif text-xs text-amber-100 group-hover:text-amber-200 font-semibold">
                {{ mood.title }}
              </div>
              <p class="text-[10px] text-neutral-400 font-serif line-clamp-2 leading-relaxed italic">
                “{{ mood.message }}”
              </p>
            </button>
          </div>
        </div>

        <!-- 2. Daily Oracle Tab -->
        <div v-else class="space-y-4 text-center py-2">
          <div class="space-y-1">
            <h3 class="text-base font-serif font-bold text-amber-100">今日灵秀花签 · Daily Bloom Oracle</h3>
            <p class="text-xs font-serif text-neutral-400">感应天地生机，抽取今日专属东方祥瑞之花</p>
          </div>

          <!-- Oracle Result Card -->
          <div class="p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 to-black/60 border border-amber-500/30 space-y-3 shadow-xl">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 text-2xl border border-amber-400/40">
              🪷
            </div>
            <div class="space-y-1">
              <span class="text-[10px] font-serif tracking-widest text-amber-300 uppercase">✦ 今日祥瑞花仙 ✦</span>
              <h4 class="text-xl font-serif font-bold text-amber-100">{{ dailyOracle.name }}</h4>
              <p class="text-xs text-amber-200/80 font-serif italic">“{{ dailyOracle.tagline }}”</p>
            </div>
            <p class="text-xs text-neutral-200 font-serif leading-relaxed px-4 pt-1">
              {{ dailyOracle.defaultMessage }}
            </p>
            <div class="pt-3">
              <button
                type="button"
                @click="applyOracle"
                class="w-full py-2.5 px-4 rounded-xl gufeng-btn-gold text-xs font-serif tracking-wider uppercase transition-all shadow-lg active:scale-95"
              >
                采撷此花 · 填入花笺
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FLOWER_MODELS, getFlowerModelById } from '~/constants/models';
import { playPopSound, playChime } from '~/utils/audioSynth';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'apply', data: { modelId: string; message: string }): void;
}>();

const activeTab = ref<'mood' | 'oracle'>('mood');

interface MoodItem {
  id: string;
  emoji: string;
  title: string;
  modelId: string;
  recommendFlowerName: string;
  message: string;
}

const moodList: MoodItem[] = [
  {
    id: 'miss',
    emoji: '🌿',
    title: '脉脉相思 · 念君安好',
    modelId: 'anemone_flower_low_poly',
    recommendFlowerName: '微风银莲花',
    message: '山水迢迢，风动如思。见字如面，愿卿岁岁平安，万事顺意。'
  },
  {
    id: 'rest',
    emoji: '🍵',
    title: '清风抚慰 · 释劳解忧',
    modelId: 'flowers_with_the_vase',
    recommendFlowerName: '清雅瓷瓶插花',
    message: '世间碌碌，辛苦良多。愿奉素瓷一枝清香，洗净尘劳，偷得浮生半日闲。'
  },
  {
    id: 'celebrate',
    emoji: '🏮',
    title: '华堂喜庆 · 芳辰嘉礼',
    modelId: 'flower_bouquet',
    recommendFlowerName: '繁花似锦礼束',
    message: '良辰吉日，繁花似锦。祝君前程明媚若霞光，所愿皆遂，岁岁常欢愉！'
  },
  {
    id: 'love',
    emoji: '❤️',
    title: '愿结同心 · 情深若许',
    modelId: 'red_rose',
    recommendFlowerName: '经典绯红玫瑰',
    message: '愿得一人心，白首不相离。满目山河皆胜景，唯有卿卿入我怀。'
  },
  {
    id: 'encourage',
    emoji: '🌟',
    title: '傲雪凌霜 · 坚韧向阳',
    modelId: 'margarita_flower',
    recommendFlowerName: '阳光雏菊',
    message: '莫道浮云终蔽日，严霜尽处是阳春。愿君心怀凌云之志，大步向晴空！'
  },
  {
    id: 'goodnight',
    emoji: '🌙',
    title: '月照幽梦 · 清夜长眠',
    modelId: 'low_poly_purple_flowers',
    recommendFlowerName: '紫夜星芒花',
    message: '夜色溶溶，月落星沉。卸去一身凡尘累，愿君今宵好梦无扰，清眠到天明。'
  }
];

// 今日花签
const dailyOracle = computed(() => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % FLOWER_MODELS.length;
  return FLOWER_MODELS[index] || FLOWER_MODELS[0];
});

function selectMood(mood: MoodItem) {
  playPopSound();
  emit('apply', {
    modelId: mood.modelId,
    message: mood.message
  });
  emit('close');
}

function applyOracle() {
  playChime(659.25);
  emit('apply', {
    modelId: dailyOracle.value.id,
    message: dailyOracle.value.defaultMessage
  });
  emit('close');
}
</script>
