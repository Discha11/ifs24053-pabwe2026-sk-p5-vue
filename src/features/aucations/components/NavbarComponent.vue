<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../auth/states/authStore'
import { showConfirmDialog } from '../../../helpers/toolsHelper'

const emit = defineEmits(['toggleSidebar'])

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

const handleLogout = async () => {
  const confirmed = await showConfirmDialog('Apakah Anda yakin ingin keluar dari akun?', 'Konfirmasi Keluar')
  if (confirmed) {
    authStore.logout()
    router.push('/auth/login')
  }
}
</script>

<template>
  <header class="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
    <div class="flex items-center space-x-4">
      <button
        @click="$emit('toggleSidebar')"
        class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20">
          DA
        </div>
        <span class="font-bold text-slate-800 text-lg tracking-tight hidden sm:inline">Delcom Auction</span>
      </div>
    </div>

    <!-- Active User & Quick Actions -->
    <div class="flex items-center space-x-4">
      <div v-if="user" class="flex items-center space-x-3">
        <img
          v-if="user.photo"
          :src="user.photo"
          :alt="user.name"
          class="w-9 h-9 rounded-full object-cover border border-slate-200"
        />
        <div
          v-else
          class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm"
        >
          {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>
        <div class="hidden md:block text-left">
          <p class="text-sm font-semibold text-slate-800 leading-tight">{{ user.name || 'Pengguna' }}</p>
          <p class="text-xs text-slate-500">{{ user.email || '' }}</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-200"
      >
        Keluar
      </button>
    </div>
  </header>
</template>
