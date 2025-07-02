<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-6">
        <h1 class="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav class="mt-6">
        <div class="px-6 py-2 space-y-1">
          <NuxtLink to="/admin" 
            class="flex items-center py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.path === '/admin' }">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            </svg>
            Dashboard
          </NuxtLink>
          
          <NuxtLink to="/admin/equipment" 
            class="flex items-center py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.path === '/admin/equipment' }">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
            Equipment
          </NuxtLink>
          
          <NuxtLink to="/admin/material" 
            class="flex items-center py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.path === '/admin/material' }">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6"></path>
            </svg>
            Material
          </NuxtLink>
          
          <NuxtLink to="/admin/borrowing" 
            class="flex items-center py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            :class="{ 'bg-blue-100 text-blue-600': $route.path === '/admin/borrowing' }">
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Borrowing Requests
            <span v-if="pendingCount > 0" class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {{ pendingCount }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm border-b">
        <div class="flex justify-between items-center px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ pageTitle }}</h2>
          <div class="flex items-center space-x-4">
            <!-- Notification Bell -->
            <button @click="showNotifications = !showNotifications" class="relative p-2 text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7 7l3.5 3.5M21 21l-6-6"></path>
              </svg>
              <span v-if="pendingCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ pendingCount }}
              </span>
            </button>
            
            <div v-if="user" class="text-sm text-gray-600">
              <span class="font-medium">{{ user.full_name }}</span>
              <span class="text-xs text-gray-400 ml-1">({{ user.permission }})</span>
            </div>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900 text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Notifications Dropdown -->
      <div v-if="showNotifications" class="absolute right-6 top-16 w-80 bg-white rounded-lg shadow-lg border z-50">
        <div class="p-4 border-b">
          <h3 class="font-semibold text-gray-800">Notifications</h3>
        </div>
        <div class="max-h-64 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-4 text-gray-500 text-center">
            No new notifications
          </div>
          <div v-else>
            <div v-for="notification in notifications" :key="notification.id" 
              class="p-4 border-b hover:bg-gray-50 cursor-pointer">
              <p class="text-sm font-medium">{{ notification.title }}</p>
              <p class="text-xs text-gray-600">{{ notification.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDateTime(notification.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/th'

const { user, sendLogout, initializeAuth } = useAuth()
const route = useRoute()

const showNotifications = ref(false)
const notifications = ref([])
const pendingCount = ref(0)

const pageTitle = computed(() => {
  const titles = {
    '/admin': 'Dashboard',
    '/admin/equipment': 'Equipment Management',
    '/admin/material': 'Material Management',
    '/admin/borrowing': 'Borrowing Requests'
  }
  return titles[route.path] || 'Admin Panel'
})

const formatDateTime = (date) => {
  const timestamp = date < 10000000000 ? date * 1000 : date
  return dayjs(timestamp).locale('th').format('D MMMM YYYY HH:mm น.')
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await sendLogout()
  }
}

// Initialize auth when layout mounts
onMounted(async () => {
  if (!user.value) {
    await initializeAuth()
  }
  
  // Load notifications and pending count
  // TODO: Implement notification fetching
  pendingCount.value = 3 // Mock data
})
</script>