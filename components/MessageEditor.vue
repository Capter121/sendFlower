<template>
  <div class="space-y-2.5">
    <!-- Header with Gu Feng Mode Switch -->
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-1.5">
        <span class="text-amber-300 font-serif font-semibold text-xs">花笺题词 · 尺素寄意</span>
      </div>
      <div class="flex items-center gap-1 p-0.5 rounded-xl bg-black/40 border border-amber-500/20">
        <button
          type="button"
          @click="isNoMessage = false"
          class="px-2.5 py-0.5 rounded-lg text-[10px] font-serif transition-all"
          :class="!isNoMessage ? 'bg-amber-500/30 text-amber-200 font-semibold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'"
        >
          题词寄语
        </button>
        <button
          type="button"
          @click="isNoMessage = true"
          class="px-2.5 py-0.5 rounded-lg text-[10px] font-serif transition-all"
          :class="isNoMessage ? 'bg-amber-500/30 text-amber-200 font-semibold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'"
        >
          仅赏繁花
        </button>
      </div>
    </div>

    <!-- Message Inputs (When not "No message") -->
    <div v-if="!isNoMessage" class="space-y-2">
      <!-- Recipient & Sender Names in one compact line -->
      <div class="grid grid-cols-2 gap-2">
        <div>
          <input
            v-model="recipient"
            type="text"
            placeholder="致 · 雅士名讳 (可选)"
            maxlength="20"
            class="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs font-serif text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 transition-colors"
          />
        </div>
        <div>
          <input
            v-model="sender"
            type="text"
            placeholder="落款 · 题赠人 (可选)"
            maxlength="20"
            class="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs font-serif text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 transition-colors"
          />
        </div>
      </div>

      <!-- Main Message Textarea styled like Rice Paper Parchment -->
      <div class="relative">
        <textarea
          v-model="message"
          rows="2"
          maxlength="250"
          :placeholder="defaultPlaceholder"
          class="w-full px-3 py-2 rounded-xl bg-black/40 border border-amber-500/25 text-xs sm:text-sm font-serif text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/60 transition-colors resize-none leading-relaxed"
        />
        <div class="absolute bottom-1.5 right-2.5 text-[9px] font-mono text-neutral-500 pointer-events-none">
          {{ message.length }}/250
        </div>
      </div>

      <!-- Quick Preset Wish Chip -->
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] font-serif text-amber-300/80 flex-shrink-0">赋诗花语:</span>
        <button
          type="button"
          @click="applyDefaultWish"
          class="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-200/90 border border-amber-500/20 transition-all text-left truncate max-w-full font-serif italic"
        >
          “{{ defaultPlaceholder }}”
        </button>
      </div>
    </div>

    <!-- No Message Hint -->
    <div v-else class="p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-center text-xs text-neutral-400">
      <p class="font-serif italic text-amber-200/80 text-[11px]">将全屏沉浸展示 3D 繁花与意境题画</p>
      <p class="text-[10px] mt-0.5 text-neutral-400 font-serif">“{{ themeTagline }}”</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  themeTagline: string;
  defaultPlaceholder: string;
  initialMessage?: string;
}>();

const emit = defineEmits<{
  (e: 'update', data: { message?: string; sender?: string; recipient?: string }): void;
}>();

const isNoMessage = ref(false);
const message = ref(props.initialMessage || '');
const sender = ref('');
const recipient = ref('');

function applyDefaultWish() {
  message.value = props.defaultPlaceholder;
}

function setMessage(text: string) {
  isNoMessage.value = false;
  message.value = text;
}

defineExpose({
  setMessage
});

watch(
  () => props.initialMessage,
  (val) => {
    if (val) {
      isNoMessage.value = false;
      message.value = val;
    }
  }
);

watch(
  [isNoMessage, message, sender, recipient],
  () => {
    if (isNoMessage.value) {
      emit('update', {
        message: undefined,
        sender: undefined,
        recipient: undefined
      });
    } else {
      emit('update', {
        message: message.value || undefined,
        sender: sender.value || undefined,
        recipient: recipient.value || undefined
      });
    }
  },
  { immediate: true }
);
</script>
