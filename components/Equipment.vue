<template>
    <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">Equipment Management</h1>

        <!-- ✅ Equipment List -->
        <div v-for="equipment in equipments" :key="equipment.id"
            class="relative bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-md">
            <button @click="openUpdateModal(equipment)"
                class="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md">
                Update
            </button>
            <button @click="deleteEquipment(equipment.id)"
                class="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">
                Delete
            </button>

            <div class="space-y-1">
                <p><strong>Asset:</strong> {{ equipment.asset_number }}</p>
                <p><strong>Name:</strong> {{ equipment.name }}</p>
                <p><strong>Type:</strong> {{ equipment.type }}</p>
                <p><strong>Year:</strong> {{ equipment.registered_year }}</p>
                <p><strong>Location:</strong> {{ equipment.location }}</p>
                <p><strong>Condition:</strong> {{ equipment.condition }}</p>
                <p><strong>Status:</strong> {{ equipment.status }}</p>
                <p class="text-sm text-gray-500">Created: {{ formatDateTime(equipment.created_at) }}</p>
            </div>
        </div>

        <!-- ✅ Create Button -->
        <div class="text-center mt-8">
            <button @click="openCreateModal"
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg">
                Create Equipment
            </button>
        </div>

        <!-- ✅ Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white w-full max-w-xl mx-auto rounded-xl shadow-lg p-6 space-y-4">
                <h2 class="text-xl font-bold mb-4">
                    {{ editingEquipment ? 'Update Equipment' : 'Create Equipment' }}
                </h2>

                <div class="opacity-30">
                    <label class="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input type="text" v-model="form.id"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        disabled>
                </div>
                <!-- แก้ตรง input render -->
                <div v-for="field in fieldList" :key="field.model">
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>

                    <select v-if="field.type === 'select'" v-model="form[field.model]"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                        <option disabled value="">-- กรุณาเลือก --</option>
                        <option v-for="option in field.options" :key="option" :value="option">
                            {{ option }}
                        </option>
                    </select>

                    <input v-else v-model="form[field.model]" :type="field.type"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                </div>


                <div class="flex justify-end space-x-3 mt-4">
                    <button @click="submitForm" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                        {{ editingEquipment ? 'Update' : 'Create' }}
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

import { useEquipments } from '~/composables/equipmemnt'

definePageMeta({
    title: 'Admin Page',
    middleware: ['auth'],
    layout: 'admin',
    requiresAuth: true
})

const EquipmentStore = useEquipments()
const equipments = EquipmentStore.equipments

const showModal = ref(false)
const editingEquipment = ref(null)

const form = ref({
    id: '',
    asset_number: '',
    name: '',
    registered_year: '',
    type: '',
    location: '',
    condition: '',
    status: ''
})

// ✅ ใช้สำหรับ loop field
// ใน fieldList ของ equipment:
const fieldList = [
    { model: 'asset_number', label: 'Asset Number', type: 'text' },
    { model: 'name', label: 'Name', type: 'text' },
    { model: 'registered_year', label: 'Registered Year', type: 'number' },
    { model: 'type', label: 'Type', type: 'text' },
    { model: 'location', label: 'Location', type: 'text' },
    {
        model: 'condition', label: 'Condition', type: 'select', options: [
            'ใช้งานได้', 'ชำรุด', 'ซ่อมบำรุง'
        ]
    },
    {
        model: 'status', label: 'Status', type: 'select', options: [
            'ว่าง', 'ไม่ว่าง'
        ]
    }
]


const formatDateTime = (date) => {
    const timestamp = date < 10000000000 ? date * 1000 : date
    return dayjs(timestamp).locale('th').format('D MMMM YYYY HH:mm:ss น.')
}

const openCreateModal = () => {
    editingEquipment.value = null
    form.value = {
        id: '',
        asset_number: '',
        name: '',
        registered_year: '',
        type: '',
        location: '',
        condition: '',
        status: ''
    }
    showModal.value = true
}

const openUpdateModal = (equipment) => {
    editingEquipment.value = equipment
    form.value = {
        id: equipment.id,
        asset_number: equipment.asset_number,
        name: equipment.name,
        registered_year: equipment.registered_year,
        type: equipment.type,
        location: equipment.location,
        condition: equipment.condition,
        status: equipment.status
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingEquipment.value = null
}

const submitForm = async () => {
    if (editingEquipment.value) {
        await EquipmentStore.updateEquipments({ ...form.value }, editingEquipment.value.id)
    } else {
        await EquipmentStore.createEquipments({ ...form.value })
    }
    await EquipmentStore.fetchEquipments()
    closeModal()
}

const deleteEquipment = async (id) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
        await EquipmentStore.deleteEquipments(id)
        await EquipmentStore.fetchEquipments()
    }
}

onMounted(async () => {
    await EquipmentStore.fetchEquipments()
})
</script>

<style scoped lang="scss"></style>
