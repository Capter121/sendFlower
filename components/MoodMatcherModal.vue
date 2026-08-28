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
      <div class="relative w-full max-w-lg p-5 sm:p-7 rounded-3xl glass-panel text-neutral-100 shadow-2xl border border-white/10 space-y-5 max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Mode Switch Tabs -->
        <div class="flex items-center justify-center gap-2 pt-1">
          <div class="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1">
            <button
              type="button"
              @click="activeTab = 'mood'"
              class="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
              :class="activeTab === 'mood' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'"
            >
              🔮 情绪配花助手
            </button>
            <button
              type="button"
              @click="activeTab = 'oracle'"
              class="px-4 py-1.5 rounded-xl text-xs font-medium transition-all"
              :class="activeTab === 'oracle' ? 'bg-white/20 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'"
            >
              🎴 抽取今日花签
            </button>
          </div>
        </div>

        <!-- 1. Mood Matcher Tab -->
        <div v-if="activeTab === 'mood'" class="space-y-3">
          <div class="text-center space-y-1">
            <h3 class="text-base font-serif text-white">选择你此刻想传达的心情</h3>
            <p class="text-xs text-neutral-400">系统将为你智能搭配最适花卉与意境寄语</p>
          </div>

          <div class="grid grid-cols-2 gap-2.5 pt-2">
            <button
              v-for="mood in moodList"
              :key="mood.id"
              type="button"
              @click="selectMood(mood)"
              class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/12 border border-white/10 hover:border-white/25 transition-all text-left space-y-1.5 group active:scale-[0.98]"
            >
              <div class="flex items-center justify-between">
                <span class="text-lg">{{ mood.emoji }}</span>
                <span class="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-200">
                  {{ mood.recommendFlowerName }}
                </span>
              </div>
              <div class="font-serif text-xs text-neutral-200 group-hover:text-white font-medium">
                {{ mood.title }}
              </div>
              <p class="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                “{{ mood.message }}”
              </p>
            </button>
          </div>
        </div>

        <!-- 2. Daily Oracle Tab -->
        <div v-else class="space-y-4 text-center py-2">
          <div class="space-y-1">
            <h3 class="text-base font-serif text-white">今日幸运花签 · Daily Oracle</h3>
            <p class="text-xs text-neutral-400">感应今日能量，抽取专属于你的一束灵感之花</p>
          </div>

          <!-- Oracle Result Card -->
          <div class="p-6 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 space-y-3 shadow-xl">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-2xl animate-bounce">
              ✨
            </div>
            <div class="space-y-1">
              <span class="text-[10px] font-mono tracking-widest text-amber-300 uppercase">TODAY'S BLOOM</span>
              <h4 class="text-xl font-serif text-white">{{ dailyOracle.name }}</h4>
              <p class="text-xs text-neutral-400 font-serif italic">“{{ dailyOracle.tagline }}”</p>
            </div>
            <p class="text-xs text-neutral-200 font-serif leading-relaxed px-4 pt-1">
              {{ dailyOracle.defaultMessage }}
            </p>
            <div class="pt-3">
              <button
                type="button"
                @click="applyOracle"
                class="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
              >
                选用此花并填入寄语
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
    title: '想念与挂念',
    modelId: 'anemone_flower_low_poly',
    recommendFlowerName: '微风银莲花',
    message: '微风吹过的时候，都是我在悄悄想念你。跨越山海，愿这份轻柔的牵挂温暖你。'
  },
  {
    id: 'rest',
    emoji: '☕',
    title: '辛苦与慰问',
    modelId: 'flowers_with_the_vase',
    recommendFlowerName: '清雅瓷瓶插花',
    message: '这段时间辛苦啦！放下所有疲惫，把时间留给自己，愿美好与平静常伴你左右。'
  },
  {
    id: 'celebrate',
    emoji: '🎂',
    title: '庆祝与生日',
    modelId: 'flower_bouquet',
    recommendFlowerName: '繁花似锦礼束',
    message: '愿生活如这繁花般绚烂多彩，祝你所愿皆得，万事胜意，在这个特别的时刻尽情闪耀！'
  },
  {
    id: 'love',
    emoji: '❤️',
    title: '心动与告白',
    modelId: 'red_rose',
    recommendFlowerName: '经典绯红玫瑰',
    message: '满目山河皆是风景，但唯有你是我最想停驻的温柔。愿爱意如初，岁岁相伴。'
  },
  {
    id: 'encourage',
    emoji: '🌟',
    title: '鼓励与希望',
    modelId: 'margarita_flower',
    recommendFlowerName: '阳光雏菊',
    message: '请相信自己的力量，阴霾终会散去，阳光永远为你而来，勇敢地大步向前吧！'
  },
  {
    id: 'goodnight',
    emoji: '🌙',
    title: '晚安与好梦',
    modelId: 'low_poly_purple_flowers',
    recommendFlowerName: '紫夜星芒花',
    message: '夜色深邃，星芒闪烁。卸下一整天的忙碌，愿你今夜有个甜甜的好梦，晚安。'
  }
];

// 今日花签（根据当天日期确定唯一随机种子）
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
