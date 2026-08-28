<template>
  <div class="relative min-h-screen text-neutral-100 overflow-hidden select-none bg-[#07080c]">
    <!-- 🌸 Faint Translucent Ambient Background (淡淡显示的背景图) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- 1. The faint translucent bg.jpg image -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 scale-100 transition-opacity duration-1000"
        style="background-image: url('/bg.jpg');"
      />
      <!-- 2. Soft atmospheric vignette to focus center & enhance text readability -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(circle at 50% 45%, rgba(7, 8, 12, 0.2) 0%, rgba(7, 8, 12, 0.6) 65%, rgba(7, 8, 12, 0.88) 100%);"
      />
    </div>

    <!-- Page Content -->
    <div class="relative z-10">
      <NuxtPage />
    </div>
  </div>
</template>
