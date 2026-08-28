<template>
  <div class="space-y-2.5">
    <!-- Header with Category Tabs -->
    <div class="flex items-center justify-between">
      <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
        挑选花卉 · 7大分类 ({{ FLOWER_MODELS.length }}款)
      </span>
      <span class="text-[10px] font-mono text-neutral-500">
        已选: <span class="text-neutral-300 font-sans">{{ currentModel?.name }}</span>
      </span>
    </div>

    <!-- Category Filter Tabs -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        @click="selectedCategory = cat.id"
        class="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-all border flex items-center gap-1 flex-shrink-0"
        :class="[
          selectedCategory === cat.id
            ? 'bg-white/20 border-white/40 text-white font-medium shadow-sm'
            : 'bg-white/5 border-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/10'
        ]"
      >
        <span>{{ cat.name }}</span>
        <span class="text-[9px] opacity-60 font-mono">({{ getCategoryCount(cat.id) }})</span>
      </button>
    </div>

    <!-- Models Grid Shelf (Compact & Scrollable) -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 sm:max-h-40 overflow-y-auto pr-1">
      <button
        v-for="model in filteredModels"
        :key="model.id"
        type="button"
        @click="emit('select', model.id)"
        class="relative p-2 rounded-xl flex flex-col items-start gap-0.5 transition-all text-xs border text-left group"
        :class="[
          modelValue === model.id
            ? 'bg-white/15 border-white/40 shadow-lg text-white ring-1 ring-white/20'
            : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:text-neutral-200'
        ]"
      >
        <div class="w-full flex items-center justify-between">
          <span
            class="w-2 h-2 rounded-full transition-transform"
            :style="{
              backgroundColor: model.accentColor,
              boxShadow: modelValue === model.id ? `0 0 8px ${model.accentColor}` : 'none'
            }"
            :class="modelValue === model.id ? 'scale-125' : 'opacity-60'"
          />
          <span class="text-[9px] px-1 py-0.2 rounded bg-white/5 font-mono text-neutral-400">
            {{ model.categoryLabel }}
          </span>
        </div>

        <span class="font-serif font-medium tracking-wide text-neutral-200 text-[11px] truncate max-w-full group-hover:text-white pt-0.5">
          {{ model.name }}
        </span>
        <span class="text-[9px] text-neutral-500 font-light truncate max-w-full">
          {{ model.tagline }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FLOWER_MODELS, getFlowerModelById } from '~/constants/models';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const selectedCategory = ref<string>('all');

const currentModel = computed(() => getFlowerModelById(props.modelValue));

const categories = [
  { id: 'all', name: '全部' },
  { id: 'bouquet', name: '💐 手捧' },
  { id: 'rose', name: '🌹 玫瑰' },
  { id: 'vase', name: '🏺 瓷瓶' },
  { id: 'lotus', name: '🪷 睡莲' },
  { id: 'sakura', name: '🌸 樱花' },
  { id: 'peony', name: '🌺 名花' },
  { id: 'fantasy', name: '✨ 奇幻' }
];

function getCategoryCount(catId: string) {
  if (catId === 'all') return FLOWER_MODELS.length;
  return FLOWER_MODELS.filter((m) => m.category === catId).length;
}

const filteredModels = computed(() => {
  if (selectedCategory.value === 'all') return FLOWER_MODELS;
  return FLOWER_MODELS.filter((m) => m.category === selectedCategory.value);
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
