<template>
  <div class="space-y-2">
    <!-- Header with Category Tabs -->
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-1.5">
        <span class="text-amber-300 font-serif font-semibold text-xs">芳草集 · 挑选花品</span>
        <span class="text-[10px] font-serif text-neutral-400">（共 93 款）</span>
      </div>
      <span class="text-[10px] font-serif text-amber-200/70">
        已选：{{ currentModel.name }}
      </span>
    </div>

    <!-- Category Filter Tabs (Horizontal Scrollable) -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scroll text-xs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        @click="selectedCategory = cat.id"
        class="px-2.5 py-1 rounded-xl whitespace-nowrap transition-all text-[11px] font-serif flex items-center gap-1 flex-shrink-0"
        :class="
          selectedCategory === cat.id
            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 shadow-sm font-semibold'
            : 'bg-black/40 text-neutral-400 hover:text-amber-100 hover:bg-black/60 border border-white/5'
        "
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.label }}</span>
        <span class="text-[9px] opacity-70 font-mono">({{ getCategoryCount(cat.id) }})</span>
      </button>
    </div>

    <!-- Flower Model Cards Shelf (Scrollable Grid) -->
    <div class="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1 custom-scroll">
      <button
        v-for="model in filteredModels"
        :key="model.id"
        type="button"
        @click="emit('select', model.id)"
        class="relative p-2 rounded-xl text-left transition-all border group flex flex-col justify-between min-h-[58px]"
        :class="
          model.id === modelValue
            ? 'bg-gradient-to-b from-amber-500/25 to-black/60 border-amber-400 shadow-md shadow-amber-900/20'
            : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-amber-400/40'
        "
      >
        <!-- Top Row: Category tag / Selection badge -->
        <div class="flex items-center justify-between w-full">
          <span
            class="text-[9px] px-1.5 py-0.2 rounded font-serif"
            :style="{
              color: model.accentColor,
              backgroundColor: model.accentColor + '18',
              borderColor: model.accentColor + '40',
              borderWidth: '1px'
            }"
          >
            {{ getShortCategoryLabel(model.category) }}
          </span>
          <span v-if="model.id === modelValue" class="text-amber-300 text-[10px]">
            ✦
          </span>
        </div>

        <!-- Bottom Row: Flower Name -->
        <div class="pt-1">
          <div
            class="font-serif text-[11px] font-medium truncate group-hover:text-amber-200 transition-colors"
            :class="model.id === modelValue ? 'text-amber-100 font-semibold' : 'text-neutral-300'"
          >
            {{ model.name }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FLOWER_MODELS, getFlowerModelById, type FlowerModelInfo } from '~/constants/models';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const selectedCategory = ref<string>('all');

const currentModel = computed(() => getFlowerModelById(props.modelValue));

const categories = [
  { id: 'all', label: '全部', icon: '🌸' },
  { id: 'bouquet', label: '繁花玉锦', icon: '💐' },
  { id: 'rose', label: '绛雪红芳', icon: '🌹' },
  { id: 'vase', label: '素瓷幽香', icon: '🏺' },
  { id: 'lotus', label: '碧水芙蓉', icon: '🪷' },
  { id: 'sakura', label: '桃溪落樱', icon: '🌸' },
  { id: 'peony', label: '国色天香', icon: '🌺' },
  { id: 'fantasy', label: '蓬莱仙卉', icon: '✨' }
];

function getCategoryCount(catId: string): number {
  if (catId === 'all') return FLOWER_MODELS.length;
  return FLOWER_MODELS.filter((m) => m.category === catId).length;
}

function getShortCategoryLabel(catId: string): string {
  switch (catId) {
    case 'bouquet': return '锦束';
    case 'rose': return '月季';
    case 'vase': return '插花';
    case 'lotus': return '青荷';
    case 'sakura': return '樱木';
    case 'peony': return '牡丹';
    case 'fantasy': return '仙卉';
    default: return '名花';
  }
}

const filteredModels = computed(() => {
  if (selectedCategory.value === 'all') return FLOWER_MODELS;
  return FLOWER_MODELS.filter((m) => m.category === selectedCategory.value);
});
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
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
