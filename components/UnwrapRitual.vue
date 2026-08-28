<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-1000 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-110 blur-xl pointer-events-none"
  >
    <div
      v-if="!isOpened"
      class="fixed inset-0 z-40 flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-2xl select-none"
      :style="{
        backgroundImage: `radial-gradient(circle at center, rgba(30, 25, 20, 0.6) 0%, rgba(10, 12, 16, 0.95) 100%)`
      }"
    >
      <!-- Ambient Sparkle Canvas / Floating Light Orbs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          v-for="i in 20"
          :key="i"
          class="absolute w-1.5 h-1.5 rounded-full bg-amber-200/50 animate-pulse"
          :style="{
            top: `${(i * 19) % 100}%`,
            left: `${(i * 23) % 100}%`,
            animationDelay: `${(i * 0.25)}s`,
            animationDuration: `${2 + (i % 3)}s`
          }"
        />
      </div>

      <!-- Main Ancient Scroll Envelope Box -->
      <div class="relative w-full max-w-sm p-8 rounded-3xl gufeng-panel text-center space-y-6 shadow-2xl transition-all border border-amber-500/30">
        <!-- Recipient Header -->
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-serif text-amber-200">
            <span>✦</span>
            <span>花笺尺素 · 东方雅赠</span>
            <span>✦</span>
          </div>
          <h2 class="text-2xl font-serif font-bold text-amber-100 tracking-wide pt-1">
            {{ recipient ? `致 · ${recipient} 雅鉴` : '专属于你的 3D 繁花花笺' }}
          </h2>
          <p v-if="sender" class="text-xs text-amber-200/70 font-serif italic">
            —— 来自 {{ sender }} 的真挚心意
          </p>
        </div>

        <!-- Interactive Cinnabar Wax Seal Stamp -->
        <div class="py-3 flex flex-col items-center justify-center">
          <button
            type="button"
            @click="triggerUnwrap"
            :disabled="isOpening"
            class="relative group focus:outline-none"
          >
            <!-- Glowing Pulsing Rings -->
            <div class="absolute -inset-4 rounded-full bg-gradient-to-r from-red-600/30 via-amber-500/30 to-rose-600/30 blur-lg group-hover:opacity-100 opacity-70 transition-opacity animate-pulse-slow" />
            
            <!-- Traditional Chinese Cinnabar Wax Seal Button -->
            <div class="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-gufeng-cinnabarDark via-gufeng-cinnabar to-red-500 p-[2.5px] shadow-2xl group-hover:scale-105 active:scale-95 transition-transform duration-300 border border-amber-300/40">
              <div class="w-full h-full rounded-2xl bg-gradient-to-b from-red-950/95 to-black/95 flex flex-col items-center justify-center gap-1 border border-red-400/30">
                <span class="text-2xl group-hover:rotate-12 transition-transform duration-300">🏮</span>
                <span class="text-[11px] font-brush font-bold tracking-widest text-amber-200">启封亲鉴</span>
              </div>
            </div>

            <!-- Stardust Burst Effect on Click -->
            <div
              v-if="isOpening"
              class="absolute inset-0 rounded-2xl border-4 border-amber-300 animate-ping pointer-events-none"
            />
          </button>

          <!-- Prompt Instruction -->
          <div class="pt-5 space-y-1">
            <p class="text-xs font-serif text-amber-200/90 tracking-widest animate-pulse">
              抚开朱砂红印 · 见证繁花绽放
            </p>
            <p class="text-[10px] text-neutral-400 font-serif">
              TOUCH SEAL TO UNWRAP FLORAL LETTER
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { playUnboxSparkle, playBloomSwell } from '~/utils/audioSynth';

const props = defineProps<{
  recipient?: string;
  sender?: string;
}>();

const emit = defineEmits<{
  (e: 'unwrapped'): void;
}>();

const isOpened = ref(false);
const isOpening = ref(false);

function triggerUnwrap() {
  if (isOpening.value || isOpened.value) return;
  isOpening.value = true;

  // Play audio chime and swell
  playUnboxSparkle();
  playBloomSwell();

  // Dissolve ritual cover
  setTimeout(() => {
    isOpened.value = true;
    emit('unwrapped');
  }, 650);
}
</script>
