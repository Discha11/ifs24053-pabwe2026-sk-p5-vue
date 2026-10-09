<script setup>
import { ref } from 'vue'
import { useAucationsStore } from '../states/aucationsStore'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const emit = defineEmits(['close', 'success'])
const store = useAucationsStore()

const title = ref('')
const description = ref('')
const startBid = ref('')
const closedAt = ref('')

const handleSubmit = async () => {
  if (!title.value || !description.value || startBid.value === '' || !closedAt.value) {
    alert('Semua field wajib diisi!')
    return
  }

  const success = await store.createAucation({
    title: title.value,
    description: description.value,
    start_bid: Number(startBid.value),
    closed_at: closedAt.value
  })

  if (success) {
    emit('success')
    emit('close')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-slate-800">Tambah Lelang Baru</h2>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 font-bold text-2xl" aria-label="Close">&times;</button>
      </div>

      <!-- Alert Error -->
      <div v-if="store.errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">
        {{ store.errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Judul Barang</label>
          <input 
            v-model="title" 
            type="text" 
            placeholder="Contoh: Keyboard Mechanical RGB" 
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Deskripsi Barang (Markdown)</label>
          <MarkdownEditor v-model="description" height="200px" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Harga Awal (Start Bid)</label>
          <input 
            v-model.number="startBid" 
            type="number" 
            placeholder="Contoh: 100000" 
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Batas Waktu Penutupan</label>
          <input 
            v-model="closedAt" 
            type="text" 
            placeholder="YYYY-MM-DD HH:MM:SS" 
            class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span class="text-[11px] text-slate-400 mt-1 block">Format: 2026-12-31 23:59:59</span>
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
            :disabled="store.isAucationAdd || store.loading">
            {{ store.isAucationAdd || store.loading ? 'Menyimpan...' : 'Simpan Lelang' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
