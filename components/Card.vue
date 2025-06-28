<script setup>
import { ref } from 'vue';
import { useActivities } from '../composables/activities';

const ActivitiesStore = useActivities()
const activities = ActivitiesStore.activities
const formName = ref('')
const formDescription = ref('')
const isLoading = ActivitiesStore.isLoading

const showModal = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  await ActivitiesStore.fetchActivities()
})

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  formName.value = ''
  formDescription.value = ''
  errorMessage.value = ''
  isSubmitting.value = false
}

async function submitForm() {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const success = await ActivitiesStore.createActivities({
      name: formName.value,
      description: formDescription.value
    })

    if (success) {
      closeModal()
    } else {
      errorMessage.value = 'Something went wrong while creating activity.'
    }
  } catch (err) {
    errorMessage.value = 'Error occurred: ' + err.message
  } finally {
    isSubmitting.value = false
  }
}

async function deleteActivity(id) {
  const confirmed = confirm("Are you sure you want to delete this activity?")
  if (!confirmed) return

  try {
    await ActivitiesStore.deleteActivities(id)
    await ActivitiesStore.fetchActivities()
  } catch (err) {
    alert("Failed to delete activity: " + err.message)
  }
}

</script>

<template>
  <!-- Modal สำหรับสร้าง Activity -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
      <button @click="closeModal"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold">✖</button>

      <h2 class="text-2xl font-bold text-gray-800 mb-4">Create New Activity</h2>

      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Name</label>
          <input v-model="formName" type="text"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400" placeholder="Activity name"
            required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea v-model="formDescription"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
            placeholder="Activity description" rows="3" required></textarea>
        </div>

        <div v-if="errorMessage" class="text-red-500 mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <div class="flex justify-end">
          <button type="submit" :disabled="isSubmitting"
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- ส่วนหลักของหน้า -->
  <div class="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
    <div class="flex gap-4 mb-6 items-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Available activities</h1>
      <button @click="openModal"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 hover:scale-105 focus:ring-2 focus:ring-green-400">
        ➕
      </button>
    </div>

    <!-- แสดง Loading ขณะโหลด -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      <div v-for="n in 3" :key="n" class="bg-gray-300 rounded-xl p-6 animate-pulse h-48"></div>
    </div>


    <!-- แสดงกิจกรรมหลังโหลด -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      <div v-for="activity in activities" :key="activity.id"
        class="bg-rose-500 relative rounded-xl p-6 text-white flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <!-- ปุ่มลบ -->
        <button @click="deleteActivity(activity.id)"
          class="absolute top-2 right-2 bg-white text-red-600 hover:text-white hover:bg-red-600 font-bold rounded-full w-8 h-8 flex items-center justify-center transition"
          title="Delete Activity">
          🗑️
        </button>

        <div class="flex flex-col items-center">
          <div class="text-3xl font-extrabold">{{ activity.name }}</div>
          <div class="text-3xl font-extrabold">{{ activity.description }}</div>
        </div>
        <div>
          <NuxtLink :to="`/activityDetail/${activity.id}`">
            <button
              class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition hover:scale-105 focus:ring-purple-500">
              View Detail
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>
