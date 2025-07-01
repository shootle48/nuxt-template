<template>
  <div class="space-y-6">
    <!-- Card List -->
    <div v-for="activity in activities" :key="activity.id"
      class="relative bg-white border border-gray-200 rounded-xl p-6 shadow-md">
      <button @click="openUpdateModal(activity)"
        class="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
        Update
      </button>
      <button @click="deleteActivity(activity.id)"
        class="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm">
        Delete
      </button>

      <div class="space-y-1">
        <p class="text-xl font-semibold">{{ activity.name }}</p>
        <p class="text-gray-500 text-sm">Created: {{ formatDateTime(activity.created_at) }}</p>
        <p class="text-gray-700">{{ activity.description }}</p>
        <p class="text-gray-500 text-sm">Release: {{ formatDateTime(activity.release_date) }}</p>
      </div>
    </div>

    <!-- Create Button -->
    <div class="text-center">
      <NuxtLink to="/create">
        <button class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-lg font-medium">
          Create
        </button>
      </NuxtLink>
    </div>

    <!-- Update Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg space-y-4">
        <h2 class="text-xl font-bold">Update Activity</h2>

        <div>
          <label class="block font-medium mb-1">Name</label>
          <input v-model="form.name" type="text" class="w-full border rounded-md px-3 py-2" />
        </div>

        <div>
          <label class="block font-medium mb-1">Description</label>
          <textarea v-model="form.description" rows="3" class="w-full border rounded-md px-3 py-2"></textarea>
        </div>

        <div>
          <label class="block font-medium mb-1">Release Date</label>
          <input v-model="form.release_date" type="date" class="w-full border rounded-md px-3 py-2" />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="closeModal" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
          <button @click="saveUpdate" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
            Save
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
  await ActivitiesStore.updateActivities(
    {
      name: form.value.name,
      description: form.value.description,
      release_date: form.value.release_date
        ? Math.floor(new Date(form.value.release_date).getTime() / 1000)
        : null
    },
    editingActivity.value.id
  )
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
