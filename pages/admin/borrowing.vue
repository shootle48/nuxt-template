<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Borrowing Requests</h1>

    <!-- Filter Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button @click="activeTab = 'pending'" 
            :class="activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Pending ({{ pendingRequests.length }})
          </button>
          <button @click="activeTab = 'approved'" 
            :class="activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Approved ({{ approvedRequests.length }})
          </button>
          <button @click="activeTab = 'rejected'" 
            :class="activeTab === 'rejected' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            class="py-2 px-1 border-b-2 font-medium text-sm">
            Rejected ({{ rejectedRequests.length }})
          </button>
        </nav>
      </div>
    </div>

    <!-- Requests List -->
    <div class="space-y-4">
      <div v-for="request in filteredRequests" :key="request.id" 
        class="bg-white rounded-lg shadow-md p-6 border-l-4"
        :class="{
          'border-yellow-400': request.status === 'pending',
          'border-green-400': request.status === 'approved',
          'border-red-400': request.status === 'rejected'
        }">
        
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800">{{ request.item_name }}</h3>
              <span class="ml-3 px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-800': request.status === 'pending',
                  'bg-green-100 text-green-800': request.status === 'approved',
                  'bg-red-100 text-red-800': request.status === 'rejected'
                }">
                {{ request.status.toUpperCase() }}
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Type:</strong> {{ request.item_type }}</p>
                <p><strong>Borrower:</strong> {{ request.borrower_name }}</p>
                <p><strong>Student ID:</strong> {{ request.student_id }}</p>
              </div>
              <div>
                <p><strong>Requested:</strong> {{ formatDateTime(request.created_at) }}</p>
                <p><strong>Purpose:</strong> {{ request.purpose }}</p>
                <p><strong>Duration:</strong> {{ request.duration }} days</p>
              </div>
            </div>
            
            <div v-if="request.notes" class="mt-3 p-3 bg-gray-50 rounded">
              <p class="text-sm"><strong>Notes:</strong> {{ request.notes }}</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div v-if="request.status === 'pending'" class="ml-6 flex space-x-2">
            <button @click="approveRequest(request.id)" 
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">
              Approve
            </button>
            <button @click="rejectRequest(request.id)" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredRequests.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No {{ activeTab }} requests</h3>
      <p class="mt-1 text-sm text-gray-500">No borrowing requests found for this status.</p>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'
import 'dayjs/locale/th'

definePageMeta({
  title: 'Borrowing Requests',
  middleware: ['auth', 'admin'],
  layout: 'admin',
  requiresAuth: true
})

const BorrowingStore = useBorrowing()
const activeTab = ref('pending')

const borrowingRequests = BorrowingStore.borrowingRequests

const pendingRequests = computed(() => 
  borrowingRequests.value.filter(req => req.status === 'pending')
)
const approvedRequests = computed(() => 
  borrowingRequests.value.filter(req => req.status === 'approved')
)
const rejectedRequests = computed(() => 
  borrowingRequests.value.filter(req => req.status === 'rejected')
)

const filteredRequests = computed(() => {
  switch (activeTab.value) {
    case 'pending': return pendingRequests.value
    case 'approved': return approvedRequests.value
    case 'rejected': return rejectedRequests.value
    default: return []
  }
})

const formatDateTime = (date) => {
  const timestamp = date < 10000000000 ? date * 1000 : date
  return dayjs(timestamp).locale('th').format('D MMMM YYYY HH:mm น.')
}

const approveRequest = async (id) => {
  if (confirm('Are you sure you want to approve this request?')) {
    await BorrowingStore.updateBorrowingStatus(id, 'approved')
    await BorrowingStore.fetchBorrowingRequests()
  }
}

const rejectRequest = async (id) => {
  if (confirm('Are you sure you want to reject this request?')) {
    await BorrowingStore.updateBorrowingStatus(id, 'rejected')
    await BorrowingStore.fetchBorrowingRequests()
  }
}

onMounted(async () => {
  await BorrowingStore.fetchBorrowingRequests()
})
</script>