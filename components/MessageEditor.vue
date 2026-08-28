<template>
  <div class="space-y-2.5">
    <!-- Header with Toggle -->
    <div class="flex items-center justify-between text-xs">
      <span class="text-[10px] font-mono uppercase tracking-widest text-neutral-400">寄语定制 / Message</span>
      <div class="flex items-center gap-1 p-0.5 rounded-full bg-white/5 border border-white/5">
        <button
          type="button"
          @click="isNoMessage = false"
          class="px-2.5 py-0.5 rounded-full text-[10px] transition-all"
          :class="!isNoMessage ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-neutral-400 hover:text-neutral-200'"
        >
          添加留言
        </button>
        <button
          type="button"
          @click="isNoMessage = true"
          class="px-2.5 py-0.5 rounded-full text-[10px] transition-all"
          :class="isNoMessage ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-neutral-400 hover:text-neutral-200'"
        >
          纯花束展示
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
            placeholder="致 某某 (称呼/可选)"
            maxlength="20"
            class="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <input
            v-model="sender"
            type="text"
            placeholder="来自 某某 (署名/可选)"
            maxlength="20"
            class="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <!-- Main Message Textarea -->
      <div class="relative">
        <textarea
          v-model="message"
          rows="2"
          maxlength="250"
          :placeholder="defaultPlaceholder"
          class="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors resize-none leading-relaxed"
        />
        <div class="absolute bottom-1.5 right-2.5 text-[9px] font-mono text-neutral-500 pointer-events-none">
          {{ message.length }}/250
        </div>
      </div>

      <!-- Quick Preset Wish Chip -->
      <div class="flex items-center gap-1.5">
        <span class="text-[9px] font-mono text-neutral-500 flex-shrink-0">推荐花语:</span>
        <button
          type="button"
          @click="applyDefaultWish"
          class="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5 transition-all text-left truncate max-w-full"
        >
          “{{ defaultPlaceholder }}”
        </button>
      </div>
    </div>

    <!-- No Message Hint -->
    <div v-else class="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-neutral-400">
      <p class="font-serif italic text-neutral-300 text-[11px]">将全屏展示 3D 真实花束与花语</p>
      <p class="text-[10px] mt-0.5 text-neutral-500">“{{ themeTagline }}”</p>
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
