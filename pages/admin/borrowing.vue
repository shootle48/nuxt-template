<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Borrowing Records Management</h1>

    <!-- Filter Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button @click="activeTab = 'equipment'" 
            :class="activeTab === 'equipment' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Equipment ({{ equipmentBorrowRecords.length }})
          </button>
          <button @click="activeTab = 'material'" 
            :class="activeTab === 'material' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Material ({{ materialBorrowRecords.length }})
          </button>
          <button @click="activeTab = 'overdue'" 
            :class="activeTab === 'overdue' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Overdue ({{ overdueRecords.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Records List -->
    <div class="space-y-4">
      <div v-for="record in filteredRecords" :key="`${activeTab}-${record.id}`" 
        class="bg-white rounded-lg shadow-md p-6 border-l-4"
        :class="{
          'border-blue-400': activeTab === 'equipment',
          'border-green-400': activeTab === 'material',
          'border-red-400': isOverdue(record.return_due),
          'border-gray-400': record.returned === 'คืนแล้ว'
        }">
        
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800">{{ getItemName(record) }}</h3>
              <span class="ml-3 px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': activeTab === 'equipment',
                  'bg-green-100 text-green-800': activeTab === 'material',
                  'bg-red-100 text-red-800': isOverdue(record.return_due),
                  'bg-gray-100 text-gray-800': record.returned === 'คืนแล้ว'
                }">
                {{ record.returned === 'คืนแล้ว' ? 'RETURNED' : (isOverdue(record.return_due) ? 'OVERDUE' : 'BORROWED') }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Borrower:</strong> {{ record.user_name || 'Unknown User' }}</p>
                <p><strong>Borrowed:</strong> {{ formatDateTime(record.borrow_date) }}</p>
                <p><strong>Due:</strong> {{ formatDateTime(record.return_due) }}</p>
              </div>
              <div>
                <p><strong>Status:</strong> {{ record.returned }}</p>
                <p><strong>Duration:</strong> {{ calculateDuration(record.borrow_date, record.return_due) }} days</p>
                <p><strong>Created:</strong> {{ formatDateTime(record.created_at) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div v-if="record.returned !== 'คืนแล้ว'" class="ml-6 flex space-x-2">
            <button @click="markAsReturned(record)" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
              Mark Returned
            </button>
            <button @click="deleteRecord(record)" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredRecords.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No {{ activeTab }} records</h3>
      <p class="mt-1 text-sm text-gray-500">No borrowing records found for this category.</p>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/th'

definePageMeta({
  title: 'Borrowing Records',
  middleware: ['auth', 'admin'],
  layout: 'admin',
  requiresAuth: true
})

const BorrowingStore = useBorrowing()
const activeTab = ref('equipment')

const equipmentBorrowRecords = BorrowingStore.equipmentBorrowRecords
const materialBorrowRecords = BorrowingStore.materialBorrowRecords

const overdueRecords = computed(() => {
  const now = Math.floor(Date.now() / 1000)
  const equipmentOverdue = equipmentBorrowRecords.value.filter(record => 
    record.return_due < now && record.returned !== 'คืนแล้ว'
  )
  const materialOverdue = materialBorrowRecords.value.filter(record => 
    record.return_due < now && record.returned !== 'คืนแล้ว'
  )
  return [...equipmentOverdue, ...materialOverdue]
})

const filteredRecords = computed(() => {
  switch (activeTab.value) {
    case 'equipment': return equipmentBorrowRecords.value
    case 'material': return materialBorrowRecords.value
    case 'overdue': return overdueRecords.value
    default: return []
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

const getItemName = (record) => {
  if (activeTab.value === 'equipment') {
    return record.equipment_name || 'Unknown Equipment'
  } else if (activeTab.value === 'material') {
    return record.material_name || 'Unknown Material'
  } else {
    // For overdue tab, determine type by checking which ID exists
    return record.equipment_name || record.material_name || 'Unknown Item'
  }
}

const markAsReturned = async (record) => {
  if (confirm('Mark this item as returned?')) {
    const payload = { returned: 'คืนแล้ว' }
    
    let success = false
    if (record.equipment_id) {
      success = await BorrowingStore.updateEquipmentBorrowRecord(payload, record.id)
    } else if (record.material_id) {
      success = await BorrowingStore.updateMaterialBorrowRecord(payload, record.id)
    }
    
    if (success) {
      await refreshData()
    }
  }
}

const deleteRecord = async (record) => {
  if (confirm('Are you sure you want to delete this record?')) {
    let success = false
    if (record.equipment_id) {
      success = await BorrowingStore.deleteEquipmentBorrowRecord(record.id)
    } else if (record.material_id) {
      success = await BorrowingStore.deleteMaterialBorrowRecord(record.id)
    }
    
    if (success) {
      await refreshData()
    }
  }
}

const refreshData = async () => {
  await BorrowingStore.fetchEquipmentBorrowRecords()
  await BorrowingStore.fetchMaterialBorrowRecords()
}

onMounted(async () => {
  await refreshData()
})
</script>