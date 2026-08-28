<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-xs">
      <span class="font-mono uppercase tracking-widest text-neutral-400">选择花朵主题 / Theme</span>
      <span class="text-neutral-400 font-serif">{{ currentTheme?.name }} · {{ currentTheme?.category }}</span>
    </div>

    <!-- Category Pill Buttons -->
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      <button
        v-for="theme in THEME_LIST"
        :key="theme.id"
        type="button"
        @click="emit('select', theme.id)"
        class="relative px-3 py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs border"
        :class="[
          modelValue === theme.id
            ? 'bg-white/15 border-white/40 shadow-lg text-white'
            : 'bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10 hover:text-neutral-200'
        ]"
      >
        <!-- Glowing Indicator Dot -->
        <span
          class="w-2.5 h-2.5 rounded-full transition-transform"
          :style="{
            backgroundColor: theme.colors.bloom,
            boxShadow: modelValue === theme.id ? `0 0 12px ${theme.colors.bloom}` : 'none'
          }"
          :class="modelValue === theme.id ? 'scale-125' : 'scale-100 opacity-60'"
        />
        <span class="font-medium tracking-wide">{{ theme.category }}</span>
        <span class="text-[10px] text-neutral-500 font-light truncate max-w-full">{{ theme.name.substring(2) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { THEME_LIST, FLOWER_THEMES } from '~/constants/themes';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const currentTheme = computed(() => FLOWER_THEMES[props.modelValue]);
</script>
