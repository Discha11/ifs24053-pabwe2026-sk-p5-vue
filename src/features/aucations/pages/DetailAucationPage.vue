<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAucationsStore } from '../states/aucationsStore'

const route = useRoute()
const store = useAucationsStore()
const auctionId = route.params.id

const bidAmount = ref('')

const loadDetail = async () => {
  if (auctionId) {
    await store.fetchAucationDetail(auctionId)
  }
}

const handleAddBid = async () => {
  if (bidAmount.value !== '' && Number(bidAmount.value) > 0) {
    const success = await store.placeBid(auctionId, Number(bidAmount.value))
    if (success) {
      bidAmount.value = ''
      loadDetail()
    }
  } else {
    alert('Masukkan nominal penawaran yang valid.')
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading -->
    <div v-if="store.loading && !store.currentAucation" class="text-center py-10 text-gray-500">
      Memuat detail lelang...
    </div>

    <!-- Content -->
    <div v-else-if="store.currentAucation" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
      <!-- Alert Messages -->
      <div v-if="store.successMessage" class="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm">
        {{ store.successMessage }}
      </div>
      <div v-if="store.errorMessage" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
        {{ store.errorMessage }}
      </div>

      <div class="flex flex-col md:flex-row gap-6 mb-6">
        <div class="w-full md:w-1/2 h-64 bg-gray-200 rounded-lg overflow-hidden">
          <img :src="store.currentAucation.cover || 'https://via.placeholder.com/400x300?text=No+Cover'" alt="Cover" class="w-full h-full object-cover" />
        </div>
        <div class="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ store.currentAucation.title }}</h1>
            <p class="text-gray-600 text-sm mb-4">{{ store.currentAucation.description }}</p>
            <div class="text-lg font-bold text-blue-600 mb-2">
              Mulai Bid: Rp {{ Number(store.currentAucation.start_bid).toLocaleString() }}
            </div>
            <div class="text-xs text-gray-500 mb-4">
              Berakhir pada: {{ store.currentAucation.closed_at }}
            </div>
          </div>
          <div class="text-xs text-gray-500 border-t pt-3">
            Pembuat: <span class="font-semibold">{{ store.currentAucation.author?.name || 'Anonim' }}</span>
          </div>
        </div>
      </div>

      <!-- Bidding Section -->
      <div class="border-t pt-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Riwayat Penawaran (Bids)</h2>
        
        <!-- Form Add Bid -->
        <div class="flex gap-2 mb-6">
          <label for="bid-amount-input" class="sr-only">Nominal Tawaran</label>
          <input 
            id="bid-amount-input"
            aria-label="Nominal tawaran"
            v-model.number="bidAmount" 
            type="number" 
            placeholder="Masukkan nominal tawaran" 
            class="border rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            @click="handleAddBid" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
            Kirim Bid
          </button>
        </div>

        <!-- Bids List -->
        <div v-if="store.currentAucation.bids && store.currentAucation.bids.length > 0" class="space-y-3">
          <div v-for="bid in store.currentAucation.bids" :key="bid.id" class="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center text-sm">
            <span class="font-semibold text-gray-700">Rp {{ Number(bid.bid || bid).toLocaleString() }}</span>
            <span class="text-xs text-gray-500">{{ bid.created_at || '' }}</span>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm italic">
          Belum ada tawaran yang diajukan untuk lelang ini.
        </div>
      </div>
    </div>
  </div>
</template>