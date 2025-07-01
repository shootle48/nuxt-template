<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

const ActivitiesStore = useActivities()
const activities = ActivitiesStore.activities

const showModal = ref(false)
const editingActivity = ref(null)
const form = ref({
  name: '',
  description: '',
  release_date: ''
})

const formatDateTime = (date) => {
  const timestamp = date < 10000000000 ? date * 1000 : date
  return dayjs(timestamp).locale('th').format('D MMMM YYYY HH:mm:ss น.')
}

const openUpdateModal = (activity) => {
  editingActivity.value = activity
  form.value = {
    name: activity.name,
    description: activity.description,
    release_date: dayjs(activity.release_date * 1000).format('YYYY-MM-DD')
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingActivity.value = null
}

const saveUpdate = async () => {
  if (!editingActivity.value) return
  await ActivitiesStore.updateActivities({
    name: form.value.name,
    description: form.value.description,
    release_date: form.value.release_date
      ? Math.floor(new Date(form.value.release_date).getTime() / 1000)
      : null
  }, editingActivity.value.id)
  await ActivitiesStore.fetchActivities()
  closeModal()
}

const deleteActivity = async (id) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    await ActivitiesStore.deleteActivities(id)
    await ActivitiesStore.fetchActivities()
  }
}

onMounted(async () => {
  await ActivitiesStore.fetchActivities()
})
</script>

<template>
  <div class="p-6">
    <div v-for="activity in activities" :key="activity.id"
      class="relative bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-md">
      <button @click="openUpdateModal(activity)"
        class="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md">
        Update
      </button>
      <button @click="deleteActivity(activity.id)"
        class="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md">
        Delete
      </button>

      <div class="space-y-2">
        <p class="text-lg font-semibold text-gray-800">{{ activity.name }}</p>
        <p class="text-sm text-gray-500">Created: {{ formatDateTime(activity.created_at) }}</p>
        <p class="text-sm text-gray-500">Release Date: {{ formatDateTime(activity.release_date) }}</p>
        <p class="text-gray-700">{{ activity.description }}</p>
      </div>
    </div>

    <div class="text-center mt-8">
      <NuxtLink to="/create">
        <button class="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl text-lg">
          Create
        </button>
      </NuxtLink>
    </div>

    <!-- ✅ Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg p-6 space-y-4">
        <h2 class="text-xl font-bold mb-4">Update Activity</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.description" rows="3"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
          <input v-model="form.release_date" type="date"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex justify-end space-x-3 mt-4">
          <button @click="saveUpdate" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            Save
          </button>
          <button @click="closeModal" class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
