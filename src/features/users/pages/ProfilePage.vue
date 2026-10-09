<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../states/usersStore'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper'

const usersStore = useUsersStore()

const name = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const selectedFile = ref(null)

onMounted(async () => {
  await usersStore.fetchProfile()
  if (usersStore.profile) {
    name.value = usersStore.profile.name || ''
  }
})

const handleUpdateProfile = async () => {
  const success = await usersStore.changeProfile({ name: name.value })
  if (success) {
    showSuccessDialog('Profil berhasil diperbarui.')
  } else {
    showErrorDialog(usersStore.errorMessage || 'Gagal memperbarui profil.')
  }
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleUploadPhoto = async () => {
  if (!selectedFile.value) return
  const success = await usersStore.changePhoto(selectedFile.value)
  if (success) {
    showSuccessDialog('Foto avatar berhasil diunggah.')
    selectedFile.value = null
  } else {
    showErrorDialog(usersStore.errorMessage || 'Gagal mengunggah foto.')
  }
}

const handleChangePassword = async () => {
  const success = await usersStore.changePassword({
    old_password: oldPassword.value,
    password: newPassword.value
  })
  if (success) {
    showSuccessDialog('Kata sandi berhasil diperbarui.')
    oldPassword.value = ''
    newPassword.value = ''
  } else {
    showErrorDialog(usersStore.errorMessage || 'Gagal memperbarui kata sandi.')
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Pengaturan Profil</h1>
      <p class="text-slate-500 text-sm mt-1">Kelola informasi akun, foto avatar, dan kata sandi Anda.</p>
    </div>

    <!-- Alert Messages -->
    <div v-if="usersStore.errorMessage" class="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
      {{ usersStore.errorMessage }}
    </div>
    <div v-if="usersStore.successMessage" class="p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-200">
      {{ usersStore.successMessage }}
    </div>

    <!-- 1. Ganti Foto Avatar -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Foto Profil</h2>
      <div class="flex items-center space-x-6">
        <img
          v-if="usersStore.profile?.photo"
          :src="usersStore.profile.photo"
          alt="Avatar"
          class="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
        />
        <div v-else class="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-2xl">
          {{ usersStore.profile?.name ? usersStore.profile.name.charAt(0).toUpperCase() : 'U' }}
        </div>

        <div class="space-y-2">
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="button"
            :disabled="usersStore.loading"
            @click="handleUploadPhoto"
            class="px-4 py-2 bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Unggah Foto
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Ubah Info Profil -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Informasi Pribadi</h2>
      <form @submit.prevent="handleUpdateProfile" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nama Lengkap</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email</label>
          <input
            :value="usersStore.profile?.email"
            disabled
            type="email"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          :disabled="usersStore.loading"
          class="px-6 py-2.5 bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
        >
          Simpan Profil
        </button>
      </form>
    </div>

    <!-- 3. Ganti Kata Sandi -->
    <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h2 class="text-lg font-bold text-slate-800">Keamanan & Kata Sandi</h2>
      <form @submit.prevent="handleChangePassword" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Kata Sandi Lama</label>
          <input
            v-model="oldPassword"
            type="password"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Kata Sandi Baru</label>
          <input
            v-model="newPassword"
            type="password"
            required
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button
          type="submit"
          :disabled="usersStore.loading"
          class="px-6 py-2.5 bg-slate-800 disabled:opacity-50 text-white text-sm font-medium rounded-xl hover:bg-slate-900 transition"
        >
          Ubah Kata Sandi
        </button>
      </form>
    </div>
  </div>
</template>
