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

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const { user, sendLogout, initializeAuth } = useAuth()
const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/admin': 'Dashboard',
    '/admin/equipment': 'Equipment Management',
    '/admin/material': 'Material Management',
    '/admin/borrowing': 'Borrowing Requests'
  }
  return titles[route.path] || 'Admin Panel'
})

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
})
</script>