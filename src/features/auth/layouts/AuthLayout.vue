<script setup lang="ts">
// Layout khusus untuk halaman login dan register
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Delcom Portal</h1>
        <p class="text-xs text-gray-500 mt-1">Silakan masuk atau daftar untuk melanjutkan</p>
      </div>

      <!-- Main Content / Router View untuk Auth -->
      <router-view />
    </div>

    <footer class="mt-6 text-center text-xs text-gray-400">
      &copy; 2026 Coding AI Council - Informatics Coursework
    </footer>
  </div>
</template>