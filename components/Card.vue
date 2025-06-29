<script setup>
import { ref, onMounted } from 'vue';
import { useActivities } from '../composables/activities';

const ActivitiesStore = useActivities();
const activities = ActivitiesStore.activities;
const isLoading = ActivitiesStore.isLoading;

const formName = ref('');
const formDescription = ref('');

const showModalCreate = ref(false);
const showModalDetail = ref(false);
const showModalUpdate = ref(false);
const selectedActivity = ref(null); // ✅ แก้ชื่อให้ถูก

const isSubmitting = ref(false);
const errorMessage = ref('');

const currentIndex = computed(() => {
  return activities.value.findIndex(a => a.id === selectedActivity.value?.id)
})

const isFirst = computed(() => currentIndex.value <= 0)
const isLast = computed(() => currentIndex.value >= activities.value.length - 1)

onMounted(async () => {
  await ActivitiesStore.fetchActivities();
});

function openModalCreate() {
  showModalCreate.value = true;
}

function openModalDetail(activity) {
  selectedActivity.value = activity;
  showModalDetail.value = true;
}

function prevActivity() {
  if (isFirst.value) return;
  selectedActivity.value = activities.value[currentIndex.value - 1];
}

function nextActivity() {
  if (isLast.value) return;
  selectedActivity.value = activities.value[currentIndex.value + 1];
}



function openModalUpdate(activity) {
  selectedActivity.value = activity;
  formName.value = activity.name || '';
  formDescription.value = activity.description || '';
  showModalUpdate.value = true;
}


function closeModal() {
  showModalCreate.value = false;
  showModalDetail.value = false;
  showModalUpdate.value = false
  selectedActivity.value = null;
  formName.value = '';
  formDescription.value = '';
  errorMessage.value = '';
  isSubmitting.value = false;
}

async function submitForm() {
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    const success = await ActivitiesStore.createActivities({
      name: formName.value,
      description: formDescription.value,
    });

    if (success) {
      closeModal();
    } else {
      errorMessage.value = 'Something went wrong while creating activity.';
    }
  } catch (err) {
    errorMessage.value = 'Error occurred: ' + err.message;
  } finally {
    isSubmitting.value = false;
  }
}

async function submitUpdateForm(formName, formDescription, id) {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const success = await ActivitiesStore.updateActivities({
      name: formName,
      description: formDescription
    }, id)

    if (success) {
      await ActivitiesStore.fetchActivities()
      closeModal()
    } else {
      errorMessage.value = 'Something went wrong while updating activity.'
    }
  } catch (err) {
    errorMessage.value = 'Error: ' + err.message
  } finally {
    isSubmitting.value = false
  }
}


async function deleteActivity(id) {
  const confirmed = confirm('Are you sure you want to delete this activity?');
  if (!confirmed) return;

  try {
    await ActivitiesStore.deleteActivities(id);
    await ActivitiesStore.fetchActivities();
  } catch (err) {
    alert('Failed to delete activity: ' + err.message);
  }
}
</script>

<template>
  <!-- Modal สำหรับสร้าง Activity -->
  <div v-if="showModalCreate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

  <!-- Modal สำหรับอัปเดต Activity -->
  <div v-if="showModalUpdate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
      <button @click="closeModal"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold">✖</button>

      <h2 class="text-2xl font-bold text-gray-800 mb-4">อัปเดตกิจกรรม</h2>

      <form @submit.prevent="submitUpdateForm(formName, formDescription, selectedActivity.id)">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">ชื่อกิจกรรม</label>
          <input v-model="formName" type="text"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400" placeholder="Activity name"
            required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea v-model="formDescription"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            placeholder="Activity description" rows="3" required></textarea>
        </div>

        <div class="flex justify-end">
          <button type="submit" :disabled="isSubmitting"
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting">Updating...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </div>
  </div>


  <!-- Modal สำหรับดูรายละเอียด Activity -->
  <div v-if="showModalDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
      <button @click="closeModal"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold">✖</button>

      <h2 class="text-2xl font-bold text-gray-800 mb-4">รายละเอียดกิจกรรม</h2>

      <!-- ปุ่มลูกศรเลื่อนกิจกรรม -->
      <div class="flex justify-between items-center mb-4">
        <button @click="prevActivity" :disabled="isFirst" class="text-2xl font-bold px-3 py-1 rounded-full transition"
          :class="isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-purple-600 hover:text-purple-800'">
          ◀
        </button>

        <button @click="nextActivity" :disabled="isLast" class="text-2xl font-bold px-3 py-1 rounded-full transition"
          :class="isLast ? 'text-gray-300 cursor-not-allowed' : 'text-purple-600 hover:text-purple-800'">
          ▶
        </button>
      </div>


      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">ชื่อกิจกรรม</label>
        <p class="text-gray-800">{{ selectedActivity?.name || '-' }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-semibold mb-2">Description</label>
        <p class="text-gray-800">{{ selectedActivity?.description || '-' }}</p>
      </div>

      <div>
        <button
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition hover:scale-105 focus:ring-purple-500">
          ลงทะเบียน
        </button>
      </div>
    </div>
  </div>



  <!-- ส่วนหลักของหน้า -->
  <div class="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
    <div class="flex gap-4 mb-6 items-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Available activities</h1>
      <button @click="openModalCreate"
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
        <!-- ปุ่มตั้งค่า (ซ้าย) และปุ่มลบ (ขวา) -->
        <div class="absolute top-2 left-2 flex gap-2">
          <button @click="openModalUpdate(activity)"
            class="bg-white text-blue-600 hover:text-white hover:bg-blue-600 font-bold rounded-full w-8 h-8 flex items-center justify-center transition"
            title="Settings">
            ⚙️
          </button>
        </div>

        <div class="absolute top-2 right-2">
          <button @click="deleteActivity(activity.id)"
            class="bg-white text-red-600 hover:text-white hover:bg-red-600 font-bold rounded-full w-8 h-8 flex items-center justify-center transition"
            title="Delete Activity">
            🗑️
          </button>
        </div>


        <div class="flex flex-col items-center">
          <div class="text-3xl font-extrabold">{{ activity.name }}</div>
          <div class="text-3xl font-extrabold">{{ activity.description }}</div>
        </div>

        <div class="flex gap-4">
          <button @click="openModalDetail(activity)"
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition hover:scale-105 focus:ring-purple-500">
            ดูรายละเอียด
          </button>
          <button
            class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition hover:scale-105 focus:ring-purple-500">
            ลงทะเบียน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
