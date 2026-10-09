<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../states/authStore'

const router = useRouter()
const store = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    alert('Semua field wajib diisi!')
    return
  }

  const success = await store.register({
    name: name.value,
    email: email.value,
    password: password.value
  })

  if (success) {
    router.push('/auth/login')
  }
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold text-gray-800 text-center mb-2">Daftar Akun Baru</h2>

    <div v-if="store.errorMessage" class="p-3 bg-red-100 text-red-700 rounded-lg text-xs">
      {{ store.errorMessage }}
    </div>
    <div v-if="store.successMessage" class="p-3 bg-green-100 text-green-700 rounded-lg text-xs">
      {{ store.successMessage }}
    </div>

    <form @submit.prevent="handleRegister" class="space-y-3">
      <div>
        <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Lengkap</label>
        <input 
          v-model="name" 
          type="text" 
          placeholder="Nama Anda" 
          class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

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
        {{ store.loading ? 'Memproses...' : 'Daftar' }}
      </button>
    </form>

    <div class="text-center text-xs text-gray-500 mt-4">
      Sudah punya akun? 
      <router-link to="/auth/login" class="text-blue-600 font-semibold hover:underline">Masuk di sini</router-link>
    </div>
  </div>
</template>