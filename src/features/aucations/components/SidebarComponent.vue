<script setup>
import { RouterLink, useRoute } from 'vue-router'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])

const route = useRoute()
</script>

<template>
  <div>
    <!-- Mobile Backdrop -->
    <div
      v-if="isOpen"
      @click="$emit('close')"
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- Sidebar Container -->
    <aside
      :class="[
        'fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo in Sidebar for mobile -->
      <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100 lg:hidden">
        <span class="font-bold text-slate-800 text-lg">Delcom Auction</span>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600" aria-label="Close Sidebar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <RouterLink
          to="/"
          @click="$emit('close')"
          :class="[
            'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition duration-200',
            route.path === '/' && !route.query.filter
              ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <svg class="w-5 h-5 mr-3 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard Lelang
        </RouterLink>

        <RouterLink
          to="/users"
          @click="$emit('close')"
          :class="[
            'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition duration-200',
            route.path === '/users'
              ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <svg class="w-5 h-5 mr-3 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Daftar Pengguna
        </RouterLink>

        <RouterLink
          to="/profile"
          @click="$emit('close')"
          :class="[
            'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition duration-200',
            route.path === '/profile'
              ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <svg class="w-5 h-5 mr-3 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profil Saya
        </RouterLink>
      </nav>

      <!-- Bottom footer inside sidebar -->
      <div class="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
        Delcom P5 VueJS &copy; 2026
      </div>
    </aside>
  </div>
</template>
