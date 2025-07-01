<template>
    <div>
        Hello from create page
        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="name" class="block text-gray-700">Activity Name</label>
                <input v-model="name" type="text" id="name" name="name" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4">
            </div>
            <div class="mb-4">
                <label for="description" class="block text-gray-700">Description</label>
                <textarea v-model="description" id="description" name="description" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4"></textarea>
            </div>
            <div class="mb-4">
                <label for="release_date" class="block text-gray-700">Release Date</label>
                <input v-model="release_date" type="date" id="release_date" name="release_date" required
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-4">
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Create
                Activity</button>
        </form>
    </div>
</template>

<script setup>
const router = useRouter()
const ActivitiesStore = useActivities()

const name = ref('')
const description = ref('')
// const release_date = ref('') // วันที่จะได้จาก <input type="date">

const handleSubmit = async () => {
    const payload = {
        name: name.value,
        description: description.value,
    }

    console.log('Form submitted with payload:', payload)

    const success = await ActivitiesStore.createActivities(payload)
    if (success) {
        router.push('/')
    }
}
definePageMeta({
  title: 'First Page',
  middleware: ['auth'], // เรียกใช้ middleware ชื่อ 'auth'
  layout: 'default',    // หรือ custom layout ถ้ามี
  requiresAuth: true    // custom field ได้เช่นกัน
})
</script>



<style lang="scss" scoped></style>