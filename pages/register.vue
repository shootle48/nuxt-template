<!-- pages/login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <form @submit.prevent="onRegister" class="bg-white p-8 rounded shadow-md w-full max-w-md space-y-5">
            <h2 class="text-2xl font-semibold text-center">Login</h2>

            <div class="flex flex-col">
                <label for="email" class="mb-1 text-sm font-medium text-gray-700">First Name</label>
                <input id="email" v-model="form.first_name" type="text" required placeholder="Enter your first name"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="flex flex-col">
                <label for="email" class="mb-1 text-sm font-medium text-gray-700">Last Name</label>
                <input id="email" v-model="form.last_name" type="text" required placeholder="Enter your last name"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class=" flex flex-col">
                <label for="student_number" class="mb-1 text-sm font-medium text-gray-700">Student Number</label>
                <input id="student_number" v-model="form.student_number" type="text" required
                    placeholder="Enter your student number"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="flex flex-col">
                <label for="password" class="mb-1 text-sm font-medium text-gray-700">Password</label>
                <input id="password" v-model="form.password" type="password" required placeholder="Enter your password"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>

            <button type="submit" :disabled="isLoading"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isLoading ? "Logging in..." : "Login" }}
            </button>
        </form>
    </div>
</template>

<script setup>
const form = ref({
    first_name: '',
    last_name: '',
    student_number: '',
    password: '',
})

const isLoading = ref(false)
const router = useRouter()
const authStore = useAuth()

const onRegister = async () => {
    console.log(form.value)
    isLoading.value = true

    await authStore.sendRegister(form.value)

    isLoading.value = false

    router.push('/login')
}
</script>