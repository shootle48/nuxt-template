<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Material Management</h1>

    <!-- Material List -->
    <div v-for="material in materials" :key="material.id"
      class="relative bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-md">
      <button @click="openUpdateModal(material)"
        class="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md">
        Update
      </button>
      <button @click="deleteMaterial(material.id)"
        class="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">
        Delete
      </button>

      <div class="space-y-1">
        <p><strong>Material No.:</strong> {{ material.material_number }}</p>
        <p><strong>Name:</strong> {{ material.name }}</p>
        <p><strong>Type:</strong> {{ material.type }}</p>
        <p><strong>Qty:</strong> {{ material.quantity }}</p>
        <p><strong>Location:</strong> {{ material.location }}</p>
        <p><strong>Purchase Date:</strong> {{ formatDate(material.purchase_date) }}</p>
        <p class="text-sm text-gray-500">Created: {{ formatDateTime(material.created_at) }}</p>
      </div>
    </div>

    <!-- Create Button -->
    <div class="text-center mt-8">
      <button @click="openCreateModal" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg">
        Create Material
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-xl mx-auto rounded-xl shadow-lg p-6 space-y-4">
        <h2 class="text-xl font-bold mb-4">
          {{ editingMaterial ? 'Update Material' : 'Create Material' }}
        </h2>

        <div class="opacity-30">
          <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input type="text" v-model="form.id"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" disabled>
        </div>
        <div v-for="field in fieldList" :key="field.model">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
          <input v-model="form[field.model]" :type="field.type"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex justify-end space-x-3 mt-4">
          <button @click="submitForm" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            {{ editingMaterial ? 'Update' : 'Create' }}
          </button>
          <button @click="closeModal" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

definePageMeta({
  title: 'Material Page',
  middleware: ['auth'],
  layout: 'admin',
  requiresAuth: true
})

const MaterialStore = useMaterials()
const materials = MaterialStore.materials

const showModal = ref(false)
const editingMaterial = ref(null)

const form = ref({
  id: '',
  material_number: '',
  name: '',
  purchase_date: '',
  type: '',
  quantity: '',
  location: ''
})

const fieldList = [
  { model: 'material_number', label: 'Material Number', type: 'text' },
  { model: 'name', label: 'Name', type: 'text' },
  { model: 'purchase_date', label: 'Purchase Date', type: 'date' },
  { model: 'type', label: 'Type', type: 'text' },
  { model: 'quantity', label: 'Quantity', type: 'number' },
  { model: 'location', label: 'Location', type: 'text' }
]

const formatDate = (timestamp) => {
  return dayjs.unix(timestamp).locale('th').format('D MMMM YYYY')
}
const formatDateTime = (date) => {
  const timestamp = date < 10000000000 ? date * 1000 : date
  return dayjs(timestamp).locale('th').format('D MMMM YYYY HH:mm:ss น.')
}
const openCreateModal = () => {
  editingMaterial.value = null
  form.value = {
    id:'',
    material_number: '',
    name: '',
    purchase_date: '',
    type: '',
    quantity: '',
    location: ''
  }
  showModal.value = true
}

const openUpdateModal = (material) => {
  editingMaterial.value = material
  form.value = {
    id: material.id,
    material_number: material.material_number,
    name: material.name,
    purchase_date: dayjs.unix(material.purchase_date).format('YYYY-MM-DD'),
    type: material.type,
    quantity: material.quantity,
    location: material.location
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingMaterial.value = null
}

const submitForm = async () => {
  const payload = {
    ...form.value,
    purchase_date: Math.floor(new Date(form.value.purchase_date).getTime() / 1000)
  }

  if (editingMaterial.value) {
    await MaterialStore.updateMaterials(payload, editingMaterial.value.id)
  } else {
    await MaterialStore.createMaterials(payload)
  }
  await MaterialStore.fetchMaterials()
  closeModal()
}

const deleteMaterial = async (id) => {
  if (confirm('Are you sure you want to delete this material?')) {
    await MaterialStore.deleteMaterials(id)
    await MaterialStore.fetchMaterials()
  }
}

onMounted(async () => {
  await MaterialStore.fetchMaterials()
})
</script>
