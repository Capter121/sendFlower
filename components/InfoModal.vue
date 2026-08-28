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
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      @click.self="emit('close')"
    >
      <div class="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel text-neutral-200 shadow-2xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
        <!-- Close Button -->
        <button
          @click="emit('close')"
          class="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Title -->
        <div class="space-y-1">
          <div class="text-xs uppercase tracking-widest text-neutral-400 font-mono">ABOUT PROJECT</div>
          <h3 class="text-2xl font-serif font-light text-white tracking-wide">关于数字花束 · Digital Bloom</h3>
        </div>

        <!-- Content -->
        <div class="space-y-4 text-sm font-light text-neutral-300 leading-relaxed">
          <p>
            这是一个**纯前端运行、零数据上云**的 3D 粒子数字贺卡。每一朵花均通过纯数学方程在浏览器端实时计算生成。
          </p>

          <div class="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <h4 class="text-xs font-mono text-neutral-400 tracking-wider">🔬 核心技术与工作原理</h4>
            <ul class="list-disc list-inside space-y-1.5 text-xs text-neutral-300">
              <li><strong class="text-neutral-100">极坐标叶序学 (Phyllotaxis)：</strong> 依据黄金角 \(\pi(3 - \sqrt{5})\) 生成花蕊点阵。</li>
              <li><strong class="text-neutral-100">三维贝塞尔包络与双曲凹陷：</strong> 计算花瓣点云曲面与杯状曲度。</li>
              <li><strong class="text-neutral-100">UnrealBloomPass 霓虹辉光：</strong> WebGL 实时后处理渲染自发光粒子。</li>
              <li><strong class="text-neutral-100">LZ-String URL 状态压缩：</strong> 你的留言与配置全部压缩在 URL 字符串中，无需数据库存储，保护隐私。</li>
            </ul>
          </div>

          <p class="text-xs text-neutral-400">
            生成链接后，将 URL 发送给对方，对方打开即可获得专属于他们的全屏 3D 粒子花朵绽放仪式。
          </p>
        </div>

        <div class="pt-2 flex justify-end">
          <button
            @click="emit('close')"
            class="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs tracking-wider transition-all"
          >
            我知道了
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
