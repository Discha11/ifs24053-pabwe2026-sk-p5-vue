<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../states/authStore'

const router = useRouter()
const store = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Email dan password wajib diisi!')
    return
  }

  const success = await store.login({
    email: email.value,
    password: password.value
  })

  if (success) {
    router.push('/aucations')
  }
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold text-gray-800 text-center mb-2">Masuk ke Akun</h2>

    <div v-if="store.errorMessage" class="p-3 bg-red-100 text-red-700 rounded-lg text-xs">
      {{ store.errorMessage }}
    </div>

    <form @submit.prevent="handleLogin" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
        <input 
          v-model="email" 
          type="email" 
          placeholder="nama@delcom.org" 
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Password</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="••••••••" 
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button 
        type="submit" 
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition mt-2"
        :disabled="store.loading">
        {{ store.loading ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>

    <div class="text-center text-xs text-gray-500 mt-4">
      Belum punya akun? 
      <router-link to="/auth/register" class="text-blue-600 font-semibold hover:underline">Daftar di sini</router-link>
    </div>
  </div>
</template>