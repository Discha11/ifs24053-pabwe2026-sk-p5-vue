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

const bidAmount = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  if (bidAmount.value === '' || Number(bidAmount.value) <= 0) {
    errorMessage.value = 'Masukkan nominal penawaran yang valid.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await aucationApi.addBid(props.auctionId, Number(bidAmount.value))
    if (result.status === 'success') {
      successMessage.value = result.message || 'Berhasil memberikan tawaran.'
      setTimeout(() => {
        emit('success')
        emit('close')
      }, 1000)
    } else {
      errorMessage.value = result.message || 'Gagal memberikan tawaran.'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Terjadi kesalahan sistem.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Ajukan Penawaran (Bid)</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
      </div>

      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Nominal Bid (Rp)</label>
          <input 
            v-model.number="bidAmount" 
            type="number" 
            placeholder="Contoh: 150000"
            class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            Batal
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            :disabled="loading">
            {{ loading ? 'Mengirim...' : 'Kirim Bid' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>