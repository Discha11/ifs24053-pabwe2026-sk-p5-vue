<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div class="w-20 h-20 mx-auto mb-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl font-extrabold">
        404
      </div>
      <h1 class="text-2xl font-bold text-slate-800 mb-2">Halaman Tidak Ditemukan</h1>
      <p class="text-slate-500 mb-6 text-sm">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition duration-200 shadow-md shadow-blue-500/20"
      >
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>
