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
      class="fixed inset-0 z-40 flex flex-col items-center justify-center p-6 bg-abyss-950/95 backdrop-blur-2xl select-none"
    >
      <!-- Ambient Sparkle Canvas / Floating Light Orbs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          v-for="i in 18"
          :key="i"
          class="absolute w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse"
          :style="{
            top: `${(i * 19) % 100}%`,
            left: `${(i * 23) % 100}%`,
            animationDelay: `${(i * 0.25)}s`,
            animationDuration: `${2 + (i % 3)}s`
          }"
        />
      </div>

      <!-- Main Unwrapping Seal Card -->
      <div class="relative w-full max-w-sm p-8 rounded-3xl glass-panel text-center space-y-6 border border-white/15 shadow-2xl transition-all">
        <!-- Recipient Header -->
        <div class="space-y-1.5">
          <div class="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
            ✦ SPECIAL DIGITAL GIFT ✦
          </div>
          <h2 class="text-xl font-serif text-white tracking-wide">
            {{ recipient ? `致 ${recipient}` : '专属于你的数字花束' }}
          </h2>
          <p v-if="sender" class="text-xs text-neutral-400 font-serif italic">
            来自 {{ sender }} 的心意
          </p>
        </div>

        <!-- Interactive Wax Seal Button -->
        <div class="py-4 flex flex-col items-center justify-center">
          <button
            type="button"
            @click="triggerUnwrap"
            :disabled="isOpening"
            class="relative group focus:outline-none"
          >
            <!-- Glowing Pulsing Rings -->
            <div class="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-400/30 via-rose-500/30 to-purple-500/30 blur-lg group-hover:opacity-100 opacity-70 transition-opacity animate-pulse-slow" />
            
            <!-- Seal Circle -->
            <div class="relative w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-rose-500 to-amber-400 p-[2px] shadow-2xl group-hover:scale-105 active:scale-95 transition-transform duration-300">
              <div class="w-full h-full rounded-full bg-neutral-950/90 flex flex-col items-center justify-center gap-1 border border-white/20">
                <span class="text-2xl group-hover:rotate-12 transition-transform duration-300">🌸</span>
                <span class="text-[9px] font-mono tracking-widest text-amber-200 uppercase">UNWRAP</span>
              </div>
            </div>

            <!-- Stardust Burst Effect on Click -->
            <div
              v-if="isOpening"
              class="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping pointer-events-none"
            />
          </button>

          <!-- Prompt Instruction -->
          <div class="pt-5 space-y-1">
            <p class="text-xs font-serif text-neutral-200 tracking-wider animate-pulse">
              轻触火漆印章 · 开启繁花
            </p>
            <p class="text-[10px] text-neutral-500 font-mono">
              TAP SEAL TO REVEAL 3D BLOOM
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
