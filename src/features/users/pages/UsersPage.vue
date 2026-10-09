<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '../states/usersStore'

const usersStore = useUsersStore()

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800">Direktori Pengguna</h1>
      <p class="text-slate-500 text-sm mt-1">Daftar semua pengguna terdaftar dalam platform.</p>
    </div>

    <!-- Alert / Messages -->
    <div v-if="usersStore.errorMessage" class="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
      {{ usersStore.errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="usersStore.loading" class="text-center py-12 text-slate-500">
      Memuat daftar pengguna...
    </div>

    <!-- Users Grid -->
    <div v-else-if="usersStore.users.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in usersStore.users"
        :key="user.id"
        class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition duration-200 flex items-center space-x-4"
      >
        <img
          v-if="user.photo"
          :src="user.photo"
          :alt="user.name"
          class="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
        />
        <div
          v-else
          class="w-14 h-14 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-lg"
        >
          {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
        </div>

        <div class="overflow-hidden flex-1">
          <h2 class="font-semibold text-slate-800 text-base truncate">{{ user.name }}</h2>
          <p class="text-xs text-slate-500 truncate mt-0.5">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-slate-400">
      Belum ada data pengguna.
    </div>
  </div>
</template>
