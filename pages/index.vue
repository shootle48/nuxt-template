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

    <!-- My Borrowing Status -->
    <section class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">My Borrowing Status</h2>
        <NuxtLink to="/borrowing" class="text-blue-600 hover:text-blue-800 text-sm">
          View All →
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-800">Equipment Borrowed</h3>
          <p class="text-2xl font-bold text-blue-600">{{ myEquipmentCount }}</p>
        </div>
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 class="font-semibold text-green-800">Material Borrowed</h3>
          <p class="text-2xl font-bold text-green-600">{{ myMaterialCount }}</p>
        </div>
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 class="font-semibold text-purple-800">Total Borrowed</h3>
          <p class="text-2xl font-bold text-purple-600">{{ myTotalCount }}</p>
        </div>
      </div>
    </section>

    <!-- ✅ Equipment Section -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Available Equipments</h2>
      <div v-if="equipments.length === 0" class="text-gray-500 text-center py-8">
        No equipment available
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="item in availableEquipments" :key="item.id" class="bg-white rounded-lg shadow-md p-4">
          <p class="text-lg font-semibold">{{ item.name }}</p>
          <p class="text-sm text-gray-600">Type: {{ item.type }}</p>
          <p class="text-sm text-gray-600">Location: {{ item.location }}</p>
          <p class="text-sm text-gray-600">Condition: {{ item.condition }}</p>
          <p class="text-sm text-gray-600">Status: {{ item.status }}</p>
          <button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full"
            @click="openBorrowModal('equipment', item)"
            :disabled="item.status !== 'ว่าง'">
            {{ item.status === 'ว่าง' ? 'ยืม' : 'ไม่ว่าง' }}
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
        <div v-for="material in availableMaterials" :key="material.id" class="bg-white rounded-lg shadow-md p-4">
          <p class="text-lg font-semibold">{{ material.name }}</p>
          <p class="text-sm text-gray-600">Type: {{ material.type }}</p>
          <p class="text-sm text-gray-600">Qty: {{ material.quantity }}</p>
          <p class="text-sm text-gray-600">Location: {{ material.location }}</p>
          <p class="text-sm text-gray-600">Purchase Date: {{ formatDate(material.purchase_date) }}</p>
          <button class="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full"
            @click="openBorrowModal('material', material)"
            :disabled="material.quantity <= 0">
            {{ material.quantity > 0 ? 'ยืม' : 'หมด' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Borrow Modal -->
    <div v-if="showBorrowModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold mb-4">ยืม{{ borrowForm.item_type === 'equipment' ? 'อุปกรณ์' : 'วัสดุ' }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อรายการ</label>
            <input type="text" v-model="borrowForm.item_name" disabled
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาการยืม (วัน)</label>
            <input type="number" v-model="borrowForm.duration" required min="1" max="30"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ (ถ้ามี)</label>
            <textarea v-model="borrowForm.notes"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              rows="2" placeholder="หมายเหตุเพิ่มเติม"></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button @click="submitBorrowRequest" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            ส่งคำขอ
          </button>
          <button @click="closeBorrowModal" 
            class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

const BorrowingStore = useBorrowing()
const myEquipmentBorrowRecords = BorrowingStore.myEquipmentBorrowRecords
const myMaterialBorrowRecords = BorrowingStore.myMaterialBorrowRecords

const showBorrowModal = ref(false)
const selectedItem = ref(null)

const borrowForm = ref({
  item_id: '',
  item_name: '',
  item_type: '',
  duration: 7,
  notes: ''
})

// Computed properties for available items
const availableEquipments = computed(() => 
  equipments.value.filter(item => item.status === 'ว่าง')
)

const availableMaterials = computed(() => 
  materials.value.filter(item => item.quantity > 0)
)

// Borrowing statistics
const myEquipmentCount = computed(() => myEquipmentBorrowRecords.value.length)
const myMaterialCount = computed(() => myMaterialBorrowRecords.value.length)
const myTotalCount = computed(() => myEquipmentCount.value + myMaterialCount.value)

const formatDate = (unix) =>
  dayjs.unix(unix).locale('th').format('D MMMM YYYY')

const openBorrowModal = (type, item) => {
  selectedItem.value = item
  borrowForm.value = {
    item_id: item.id,
    item_name: item.name,
    item_type: type,
    duration: 7,
    notes: ''
  }
  showBorrowModal.value = true
}

const closeBorrowModal = () => {
  showBorrowModal.value = false
  selectedItem.value = null
}

const submitBorrowRequest = async () => {
  if (!borrowForm.value.duration || borrowForm.value.duration < 1) {
    alert('กรุณาระบุระยะเวลาการยืม')
    return
  }

  const now = Math.floor(Date.now() / 1000)
  const returnDue = now + (borrowForm.value.duration * 24 * 60 * 60)

  const payload = {
    user_id: user.value.id,
    [borrowForm.value.item_type === 'equipment' ? 'equipment_id' : 'material_id']: borrowForm.value.item_id,
    admin_id: null, // Will be set when admin approves
    borrow_date: now,
    return_due: returnDue,
    returned: "ยังไม่คืน"
  }

  let success = false
  if (borrowForm.value.item_type === 'equipment') {
    success = await BorrowingStore.createEquipmentBorrowRecord(payload)
  } else {
    success = await BorrowingStore.createMaterialBorrowRecord(payload)
  }

  if (success) {
    alert('ส่งคำขอยืมเรียบร้อยแล้ว รอการอนุมัติจากผู้ดูแล')
    closeBorrowModal()
    await BorrowingStore.fetchMyEquipmentBorrowRecords()
    await BorrowingStore.fetchMyMaterialBorrowRecords()
  } else {
    alert('เกิดข้อผิดพลาดในการส่งคำขอ')
  }
}

onMounted(async () => {
  // Initialize auth if not already done
  if (!user.value) {
    await initializeAuth()
  }
  
  // Fetch data
  await EquipmentStore.fetchEquipments()
  await MaterialStore.fetchMaterials()
  await BorrowingStore.fetchMyEquipmentBorrowRecords()
  await BorrowingStore.fetchMyMaterialBorrowRecords()
})
</script>