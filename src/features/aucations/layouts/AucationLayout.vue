<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans">
    <!-- Navbar Component -->
    <NavbarComponent @toggleSidebar="toggleSidebar" />

    <div class="flex flex-1">
      <!-- Sidebar Component -->
      <SidebarComponent :isOpen="isSidebarOpen" @close="closeSidebar" />

      <!-- Main Content Area -->
      <main class="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <RouterView />
      </main>
    </div>
  </div>
</template>