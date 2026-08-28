<template>
  <div class="relative min-h-screen text-neutral-100 overflow-hidden select-none bg-[#090a0f]">
    <!-- 🌸 Faint Translucent Ambient Background (全局淡雅古风背景) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- 1. The faint translucent bg.jpg image with clear soft visibility -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 scale-100"
        style="background-image: url('/bg.jpg');"
      />
      <!-- 2. Gentle dark overlay to keep the mood serene and text crystal clear -->
      <div
        class="absolute inset-0 bg-black/35"
      />
      <!-- 3. Soft center focus radial gradient -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(circle at 50% 50%, rgba(9, 10, 15, 0) 0%, rgba(9, 10, 15, 0.5) 100%);"
      />
    </div>

    <!-- Page Content -->
    <div class="relative z-10">
      <NuxtPage />
    </div>
  </div>
</template>
