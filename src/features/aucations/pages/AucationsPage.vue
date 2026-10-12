<script setup>
import { ref, onMounted } from 'vue'
import { useAucationsStore } from '../states/aucationsStore'
import AddModal from '../modals/AddModal.vue'

const store = useAucationsStore()

const isAddModalOpen = ref(false)
const filterIsMe = ref(undefined)
const filterIsClosed = ref(undefined)

const loadData = () => {
  store.fetchAucations({
    is_me: filterIsMe.value,
    is_closed: filterIsClosed.value
  })
}

const handleSuccessAdd = () => {
  loadData()
}

const handleDelete = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus lelang ini?')) {
    await store.removeAucation(id)
    loadData()
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Daftar Pelelangan Barang</h1>
      <button 
        @click="isAddModalOpen = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition flex items-center gap-2"
        data-testid="btn-add-aucation"
      >
        <span>+ Tambah Lelang</span>
      </button>
    </div>

    <!-- Alert Messages -->
    <div v-if="store.successMessage" class="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
      {{ store.successMessage }}
    </div>
    <div v-if="store.errorMessage" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ store.errorMessage }}
    </div>

    <!-- Filter Section -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center">
      <div>
        <label for="filter-ownership" class="block text-xs font-semibold text-gray-600 mb-1">Kepemilikan</label>
        <select id="filter-ownership" aria-label="Kepemilikan" v-model="filterIsMe" @change="loadData" class="border rounded-lg px-3 py-1.5 text-sm">
          <option :value="undefined">Semua Lelang</option>
          <option :value="1">Lelang Saya</option>
        </select>
      </div>
      <div>
        <label for="filter-status" class="block text-xs font-semibold text-gray-600 mb-1">Status</label>
        <select id="filter-status" aria-label="Status" v-model="filterIsClosed" @change="loadData" class="border rounded-lg px-3 py-1.5 text-sm">
          <option :value="undefined">Semua Status</option>
          <option :value="1">Dibuka</option>
          <option :value="0">Ditutup</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-10 text-gray-500">
      Memuat data lelang...
    </div>

    <!-- Grid List -->
    <div v-else-if="store.aucations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in store.aucations" :key="item.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
        <div>
          <div class="h-48 bg-gray-200 overflow-hidden">
            <img :src="item.cover || 'https://via.placeholder.com/400x300?text=No+Cover'" alt="Cover" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <h2 class="font-bold text-lg text-gray-800 mb-1 truncate">{{ item.title }}</h2>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
            <div class="text-sm font-semibold text-blue-600 mb-2">
              Mulai Bid: Rp {{ Number(item.start_bid).toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500">
              Berakhir: {{ item.closed_at }}
            </div>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <span class="text-xs text-gray-500">Oleh: {{ item.author?.name || 'Anonim' }}</span>
          <button @click="handleDelete(item.id)" class="btn-delete text-red-600 hover:text-red-800 text-xs font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-100">
      <p class="text-gray-500 text-sm">Belum ada data lelang yang tersedia.</p>
    </div>

    <!-- Modal Tambah Lelang -->
    <AddModal
      v-if="isAddModalOpen"
      @close="isAddModalOpen = false"
      @success="handleSuccessAdd"
    />
  </div>
</template>