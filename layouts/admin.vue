<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg">
      <div class="p-6">
        <h1 class="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav class="mt-6">
        <div class="px-6 py-2">
          <NuxtLink to="/admin" class="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
            Dashboard
          </NuxtLink>
          <NuxtLink to="/admin/equipment" class="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
            Equipment
          </NuxtLink>
          <NuxtLink to="/admin/material" class="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded">
            Material
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm border-b">
        <div class="flex justify-between items-center px-6 py-4">
          <h2 class="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
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