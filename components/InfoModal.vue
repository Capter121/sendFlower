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
      <div class="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl gufeng-panel text-neutral-200 shadow-2xl border border-amber-500/30 space-y-5 max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-neutral-400 hover:text-amber-200 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Title -->
        <div class="space-y-1">
          <div class="text-[10px] uppercase tracking-widest text-amber-300 font-serif">✦ 题跋 · 芳华记 ✦</div>
          <h3 class="text-xl font-serif font-bold text-amber-100 tracking-wide">关于花笺记 · 3D 东方数字花笺</h3>
        </div>

        <!-- Content -->
        <div class="space-y-4 text-xs sm:text-sm font-serif text-neutral-300 leading-relaxed">
          <p>
            云中谁寄锦书来，雁字回时，月满西楼。
            《花笺记》是一个**纯前端运行、零数据库上云**的东方美学 3D 虚拟花束与数字花笺。
          </p>

          <div class="p-4 rounded-2xl bg-black/50 border border-amber-500/20 space-y-2">
            <h4 class="text-xs font-serif text-amber-300 font-semibold tracking-wider">🏮 东方意境与核心技术</h4>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-neutral-300">
              <li><strong class="text-amber-200">93 款真实 3D 花卉画阁：</strong> 涵盖手捧锦束、绛雪月季、素瓷幽香、碧水青荷、桃溪落樱、国色牡丹等七大古风品类。</li>
              <li><strong class="text-amber-200">纯原生 Web Audio 空间声学：</strong> 零外部音频文件依赖，算法实时合成水晶风铃与盛开共鸣。</li>
              <li><strong class="text-amber-200">手机陀螺仪重力视差：</strong> 倾斜设备感受真切的 3D 重力流转与浮游光斑。</li>
              <li><strong class="text-amber-200">LZ-String 尺素封缄：</strong> 寄语与花品高密度压缩进 URL 密符中，不存云端，纯享私密。</li>
            </ul>
          </div>

          <p class="text-xs text-amber-200/70 font-serif italic">
            生成链接后，将花笺链接发送给远方知己，对方轻触朱砂印章，即可开启属于他们的繁花盛典。
          </p>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            @click="emit('close')"
            class="px-5 py-2 rounded-xl gufeng-btn-gold text-xs font-serif tracking-wider transition-all"
          >
            知晓并返回
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
