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
            <NuxtLink v-if="isUser" to="/courses" class="text-gray-600 hover:text-gray-900">My Courses</NuxtLink>
            <NuxtLink v-if="isAdmin" to="/admin" class="text-blue-600 hover:text-blue-800 font-medium">Admin</NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ user?.full_name }}</span>
              <span class="text-xs text-gray-400 ml-1">({{ user?.permission || user?.role }})</span>
            </div>
            <button @click="handleLogout" class="text-gray-600 hover:text-gray-900 text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

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

const { user, isAuthenticated, isAdmin, isUser, sendLogout } = useAuth()

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await sendLogout()
  }
}
</script>
