<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        Welcome, {{ user?.full_name || 'User' }}!
      </h1>
      <div class="text-sm text-gray-600 mb-2">
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <p><strong>Student ID:</strong> {{ user?.student_id }}</p>
        <p><strong>Role:</strong> {{ user?.permission || user?.role }}</p>
      </div>
    </div>

    <!-- ✅ Equipment Section -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Available Equipments</h2>
      <div v-if="equipments.length === 0" class="text-gray-500 text-center py-8">
        No equipment available
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in equipments" :key="item.id" class="bg-white rounded-lg shadow-md p-4">
          <p class="text-lg font-semibold">{{ item.name }}</p>
          <p class="text-sm text-gray-600">Type: {{ item.type }}</p>
          <p class="text-sm text-gray-600">Location: {{ item.location }}</p>
          <p class="text-sm text-gray-600">Condition: {{ item.condition }}</p>
          <p class="text-sm text-gray-600">Status: {{ item.status }}</p>
          <button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            @click="handleBorrow('equipment', item)">
            ยืม
          </button>
        </div>
      </div>
    </section>

    <!-- ✅ Material Section -->
    <section>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Available Materials</h2>
      <div v-if="materials.length === 0" class="text-gray-500 text-center py-8">
        No materials available
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="material in materials" :key="material.id" class="bg-white rounded-lg shadow-md p-4">
          <p class="text-lg font-semibold">{{ material.name }}</p>
          <p class="text-sm text-gray-600">Type: {{ material.type }}</p>
          <p class="text-sm text-gray-600">Qty: {{ material.quantity }}</p>
          <p class="text-sm text-gray-600">Location: {{ material.location }}</p>
          <p class="text-sm text-gray-600">Purchase Date: {{ formatDate(material.purchase_date) }}</p>
          <button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            @click="handleBorrow('material', material)">
            ยืม
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

definePageMeta({
  title: 'Dashboard',
  middleware: ['auth'],
  layout: 'default'
})

const { user, initializeAuth } = useAuth()

const EquipmentStore = useEquipments()
const equipments = EquipmentStore.equipments

const MaterialStore = useMaterials()
const materials = MaterialStore.materials

const formatDate = (unix) =>
  dayjs.unix(unix).locale('th').format('D MMMM YYYY')

const handleBorrow = (type, item) => {
  alert(`คุณเลือกที่จะยืม ${type === 'equipment' ? 'อุปกรณ์' : 'วัสดุ'}: ${item.name}`)
  // TODO: ทำฟังก์ชันยืมต่อภายหลัง
}

onMounted(async () => {
  // Initialize auth if not already done
  if (!user.value) {
    await initializeAuth()
  }
  
  // Fetch data
  await EquipmentStore.fetchEquipments()
  await MaterialStore.fetchMaterials()
})
</script>