<script setup>
import { ref } from 'vue'
import { useAucationsStore } from '../states/aucationsStore'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const props = defineProps({
  auction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])
const store = useAucationsStore()

const title = ref(props.auction.title || '')
const description = ref(props.auction.description || '')
const startBid = ref(props.auction.start_bid || '')
const closedAt = ref(props.auction.closed_at || '')

const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  if (!title.value || !description.value || startBid.value === '' || !closedAt.value) {
    errorMessage.value = 'Semua field wajib diisi!'
    return
  }

  errorMessage.value = ''
  const success = await store.updateAucation(props.auction.id, {
    title: title.value,
    description: description.value,
    start_bid: Number(startBid.value),
    closed_at: closedAt.value
  })

  if (success) {
    successMessage.value = 'Lelang berhasil diperbarui.'
    emit('success')
    emit('close')
  } else {
    errorMessage.value = store.errorMessage || 'Gagal memperbarui lelang.'
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-slate-800">Perbarui Data Lelang</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 font-bold text-2xl" aria-label="Close">&times;</button>
      </div>

      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Judul Barang</label>
          <input 
            v-model="title" 
            type="text" 
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Deskripsi (Markdown)</label>
          <MarkdownEditor v-model="description" height="200px" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Harga Awal (Start Bid)</label>
          <input 
            v-model.number="startBid" 
            type="number" 
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Batas Waktu Penutupan</label>
          <input 
            v-model="closedAt" 
            type="text" 
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            :disabled="store.isAucationChange || store.loading">
            {{ store.isAucationChange || store.loading ? 'Menyimpan...' : 'Perbarui Lelang' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
