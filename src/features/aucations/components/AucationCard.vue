<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['delete', 'detail'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between">
    <div>
      <div class="h-48 bg-gray-200 overflow-hidden relative">
        <img 
          :src="item.cover || 'https://via.placeholder.com/400x300?text=No+Cover'" 
          alt="Cover" 
          class="w-full h-full object-cover"
        />
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
      <div class="flex gap-2">
        <button 
          @click="$emit('detail', item.id)" 
          class="text-blue-600 hover:text-blue-800 text-xs font-medium px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50 transition">
          Detail
        </button>
        <button 
          @click="$emit('delete', item.id)" 
          class="text-red-600 hover:text-red-800 text-xs font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition">
          Hapus
        </button>
      </div>
    </div>
  </div>
</template>