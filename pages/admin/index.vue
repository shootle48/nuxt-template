<template>
  <div class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Stats Cards -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Equipment</p>
            <p class="text-2xl font-semibold text-gray-900">{{ equipments.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1v6m6-6v6"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Materials</p>
            <p class="text-2xl font-semibold text-gray-900">{{ materials.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Equipment Borrowed</p>
            <p class="text-2xl font-semibold text-gray-900">{{ equipmentBorrowedCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Material Borrowed</p>
            <p class="text-2xl font-semibold text-gray-900">{{ materialBorrowedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Borrowing Records -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Recent Borrowing Records</h2>
        <NuxtLink to="/admin/borrowing" class="text-blue-600 hover:text-blue-800 text-sm">
          View All →
        </NuxtLink>
      </div>
      
      <div v-if="recentRecords.length === 0" class="text-center py-8 text-gray-500">
        No borrowing records found
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in recentRecords" :key="`${record.type}-${record.id}`">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ record.item_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-800': record.type === 'equipment',
                    'bg-green-100 text-green-800': record.type === 'material'
                  }">
                  {{ record.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ record.user_name || 'Unknown User' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-gray-100 text-gray-800': record.returned === 'คืนแล้ว',
                    'bg-yellow-100 text-yellow-800': record.returned === 'ยังไม่คืน',
                    'bg-red-100 text-red-800': isOverdue(record.return_due) && record.returned !== 'คืนแล้ว'
                  }">
                  {{ record.returned === 'คืนแล้ว' ? 'returned' : (isOverdue(record.return_due) ? 'overdue' : 'borrowed') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(record.borrow_date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

definePageMeta({
  title: 'Admin Dashboard',
  middleware: ['auth', 'admin'],
  layout: 'admin',
  requiresAuth: true
})

const EquipmentStore = useEquipments()
const equipments = EquipmentStore.equipments

const MaterialStore = useMaterials()
const materials = MaterialStore.materials

const BorrowingStore = useBorrowing()
const equipmentBorrowRecords = BorrowingStore.equipmentBorrowRecords
const materialBorrowRecords = BorrowingStore.materialBorrowRecords

const equipmentBorrowedCount = computed(() => 
  equipmentBorrowRecords.value.filter(record => record.returned !== 'คืนแล้ว').length
)

const materialBorrowedCount = computed(() => 
  materialBorrowRecords.value.filter(record => record.returned !== 'คืนแล้ว').length
)

const recentRecords = computed(() => {
  const equipmentRecords = equipmentBorrowRecords.value.map(record => ({
    ...record,
    type: 'equipment',
    item_name: record.equipment_name || 'Unknown Equipment'
  }))
  
  const materialRecords = materialBorrowRecords.value.map(record => ({
    ...record,
    type: 'material',
    item_name: record.material_name || 'Unknown Material'
  }))
  
  return [...equipmentRecords, ...materialRecords]
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, 5)
})

const formatDateTime = (timestamp) => {
  return dayjs.unix(timestamp).locale('th').format('D MMM YYYY')
}

const isOverdue = (returnDue) => {
  const now = Math.floor(Date.now() / 1000)
  return now > returnDue
}

onMounted(async () => {
  try {
    await Promise.all([
      EquipmentStore.fetchEquipments(),
      MaterialStore.fetchMaterials(),
      BorrowingStore.fetchEquipmentBorrowRecords(),
      BorrowingStore.fetchMaterialBorrowRecords()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>