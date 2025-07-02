<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">My Borrowing History</h1>

    <!-- Status Filter -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button @click="activeTab = 'all'" 
            :class="activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            All ({{ allBorrowRecords.length }})
          </button>
          <button @click="activeTab = 'equipment'" 
            :class="activeTab === 'equipment' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Equipment ({{ myEquipmentBorrowRecords.length }})
          </button>
          <button @click="activeTab = 'material'" 
            :class="activeTab === 'material' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Material ({{ myMaterialBorrowRecords.length }})
          </button>
          <button @click="activeTab = 'returned'" 
            :class="activeTab === 'returned' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Returned ({{ returnedRecords.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Records List -->
    <div class="space-y-4">
      <div v-for="record in filteredRecords" :key="`${record.type}-${record.id}`" 
        class="bg-white rounded-lg shadow-md p-6 border-l-4"
        :class="{
          'border-blue-400': record.type === 'equipment',
          'border-green-400': record.type === 'material',
          'border-gray-400': record.returned === 'คืนแล้ว'
        }">
        
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800">{{ record.item_name }}</h3>
              <span class="ml-3 px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': record.type === 'equipment',
                  'bg-green-100 text-green-800': record.type === 'material'
                }">
                {{ record.type.toUpperCase() }}
              </span>
              <span v-if="record.returned === 'คืนแล้ว'" class="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                RETURNED
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Borrowed:</strong> {{ formatDateTime(record.borrow_date) }}</p>
                <p><strong>Due:</strong> {{ formatDateTime(record.return_due) }}</p>
                <p><strong>Status:</strong> {{ record.returned }}</p>
              </div>
              <div>
                <p v-if="record.admin_name"><strong>Approved by:</strong> {{ record.admin_name }}</p>
                <p><strong>Duration:</strong> {{ calculateDuration(record.borrow_date, record.return_due) }} days</p>
                <p><strong>Created:</strong> {{ formatDateTime(record.created_at) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="ml-6">
            <div v-if="record.returned === 'คืนแล้ว'" class="text-center">
              <div class="text-gray-600 font-semibold">✓ Returned</div>
              <div class="text-xs text-gray-500 mt-1">Item returned</div>
            </div>
            <div v-else-if="isOverdue(record.return_due)" class="text-center">
              <div class="text-red-600 font-semibold">⚠ Overdue</div>
              <div class="text-xs text-gray-500 mt-1">Please return</div>
            </div>
            <div v-else class="text-center">
              <div class="text-blue-600 font-semibold">📋 Borrowed</div>
              <div class="text-xs text-gray-500 mt-1">In use</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredRecords.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No borrowing records</h3>
      <p class="mt-1 text-sm text-gray-500">You haven't borrowed any items yet.</p>
      <div class="mt-6">
        <NuxtLink to="/" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
          Browse Items
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

definePageMeta({
  title: 'My Borrowing',
  middleware: ['auth'],
  layout: 'default'
})

const BorrowingStore = useBorrowing()
const activeTab = ref('all')

const myEquipmentBorrowRecords = BorrowingStore.myEquipmentBorrowRecords
const myMaterialBorrowRecords = BorrowingStore.myMaterialBorrowRecords

// Combine all records with type indicator
const allBorrowRecords = computed(() => {
  const equipmentRecords = myEquipmentBorrowRecords.value.map(record => ({
    ...record,
    type: 'equipment',
    item_name: record.equipment_name || 'Unknown Equipment'
  }))
  
  const materialRecords = myMaterialBorrowRecords.value.map(record => ({
    ...record,
    type: 'material',
    item_name: record.material_name || 'Unknown Material'
  }))
  
  return [...equipmentRecords, ...materialRecords].sort((a, b) => b.created_at - a.created_at)
})

const returnedRecords = computed(() => 
  allBorrowRecords.value.filter(record => record.returned === 'คืนแล้ว')
)

const filteredRecords = computed(() => {
  switch (activeTab.value) {
    case 'equipment': 
      return myEquipmentBorrowRecords.value.map(record => ({
        ...record,
        type: 'equipment',
        item_name: record.equipment_name || 'Unknown Equipment'
      }))
    case 'material': 
      return myMaterialBorrowRecords.value.map(record => ({
        ...record,
        type: 'material',
        item_name: record.material_name || 'Unknown Material'
      }))
    case 'returned': return returnedRecords.value
    default: return allBorrowRecords.value
  }
})

const formatDateTime = (timestamp) => {
  return dayjs.unix(timestamp).locale('th').format('D MMMM YYYY HH:mm น.')
}

const calculateDuration = (borrowDate, returnDue) => {
  return Math.ceil((returnDue - borrowDate) / (24 * 60 * 60))
}

const isOverdue = (returnDue) => {
  const now = Math.floor(Date.now() / 1000)
  return now > returnDue
}

onMounted(async () => {
  await BorrowingStore.fetchMyEquipmentBorrowRecords()
  await BorrowingStore.fetchMyMaterialBorrowRecords()
})
</script>