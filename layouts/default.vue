<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navigation -->
    <nav v-if="isAuthenticated" class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="text-xl font-bold text-gray-800">
            MyApp
          </NuxtLink>

          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink v-if="isUser" to="/" class="text-gray-600 hover:text-gray-900">Dashboard</NuxtLink>
            <NuxtLink v-if="isUser" to="/borrowing" class="text-gray-600 hover:text-gray-900">My Borrowing</NuxtLink>
            <NuxtLink v-if="isAdmin" to="/admin" class="text-blue-600 hover:text-blue-800 font-medium">Admin</NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notification Bell for Users -->
            <button v-if="isUser" @click="showNotifications = !showNotifications" class="relative p-2 text-gray-600 hover:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.07 2.82l3.12 3.12M7 7l3.5 3.5M21 21l-6-6"></path>
              </svg>
              <span v-if="userNotificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ userNotificationCount }}
              </span>
            </button>
            
            <div v-if="user" class="text-sm text-gray-600">
              <span class="font-medium">{{ user.full_name }}</span>
              <span class="text-xs text-gray-400 ml-1">({{ user.permission || user.role }})</span>
            </div>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900 text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- User Notifications Dropdown -->
    <div v-if="showNotifications && isUser" class="absolute right-6 top-16 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div class="p-4 border-b">
        <h3 class="font-semibold text-gray-800">Notifications</h3>
      </div>
      <div class="max-h-64 overflow-y-auto">
        <div v-if="userNotifications.length === 0" class="p-4 text-gray-500 text-center">
          No new notifications
        </div>
        <div v-else>
          <div v-for="notification in userNotifications" :key="notification.id" 
            class="p-4 border-b hover:bg-gray-50 cursor-pointer">
            <p class="text-sm font-medium">{{ notification.title }}</p>
            <p class="text-xs text-gray-600">{{ notification.message }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatDateTime(notification.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <footer v-if="isAuthenticated" class="bg-white border-t py-4">
      <div class="text-center text-sm text-gray-600">© 2025 MyApp. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/th'

const { user, isAuthenticated, isAdmin, isUser, sendLogout, initializeAuth } = useAuth()

const showNotifications = ref(false)
const userNotifications = ref([])
const userNotificationCount = ref(0)

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
  
  // Load user notifications
  // TODO: Implement user notification fetching
  userNotificationCount.value = 2 // Mock data
})
</script>