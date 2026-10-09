<script setup>
import { ref } from 'vue'
import { aucationApi } from '../api/aucationApi'

const props = defineProps({
  auctionId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const fileInput = ref(null)
const previewUrl = ref(null)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  const files = fileInput.value?.files
  if (!files || files.length === 0) {
    errorMessage.value = 'Silakan pilih file gambar terlebih dahulu.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await aucationApi.updateCover(props.auctionId, files[0])
    if (result.status === 'success') {
      successMessage.value = result.message || 'Berhasil mengubah cover'
      emit('success')
      emit('close')
    } else {
      errorMessage.value = result.message || 'Gagal mengubah cover'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-slate-800">Ganti Cover Lelang</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 font-bold text-2xl" aria-label="Close">&times;</button>
      </div>

      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
        {{ errorMessage }}
      </div>

      <!-- Live Preview -->
      <div v-if="previewUrl" class="mb-4 rounded-xl overflow-hidden border border-slate-200">
        <img :src="previewUrl" alt="Live Preview" class="w-full h-48 object-cover" />
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-2">Pilih Berkas Gambar (Cover)</label>
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            @change="handleFileChange"
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <div class="flex justify-end gap-3 pt-3">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">
            Batal
          </button>
          <button 
            type="submit" 
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
            :disabled="loading">
            {{ loading ? 'Mengunggah...' : 'Unggah Cover' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>