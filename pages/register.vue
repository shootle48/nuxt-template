<!-- pages/register.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <form @submit.prevent="onRegister" class="bg-white p-8 rounded shadow-md w-full max-w-md space-y-5">
            <h2 class="text-2xl font-semibold text-center">Register</h2>

            <div class="flex flex-col">
                <label for="student_id" class="mb-1 text-sm font-medium text-gray-700">Student ID</label>
                <input id="student_id" v-model="form.student_id" type="text" required placeholder="Enter your student id"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="flex flex-col">
                <label for="full_name" class="mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <input id="full_name" v-model="form.full_name" type="text" required placeholder="Enter your full name"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="flex flex-col">
                <label for="email" class="mb-1 text-sm font-medium text-gray-700">Email</label>
                <input id="email" v-model="form.email" type="email" required
                    placeholder="Enter your email address"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div class="flex flex-col">
                <label for="password" class="mb-1 text-sm font-medium text-gray-700">Password</label>
                <input id="password" v-model="form.password" type="password" required placeholder="Enter your password"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
            <div v-if="success" class="text-green-600 text-sm text-center">{{ success }}</div>

            <button type="submit" :disabled="isLoading"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isLoading ? "Registering..." : "Register" }}
            </button>

            <div class="text-center">
                <p class="text-sm text-gray-600">
                    Already have an account? 
                    <NuxtLink to="/login" class="text-green-500 hover:text-green-600 font-medium">Login here</NuxtLink>
                </p>
            </div>
        </form>
    </div>
</template>

<script setup>
const form = ref({
    student_id: '',
    full_name: '',
    email: '',
    password: '',
    permission: 'user'
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')
const router = useRouter()
const authStore = useAuth()

const onRegister = async () => {
    try {
        // Reset messages
        error.value = ''
        success.value = ''
        isLoading.value = true

        // ตั้งค่า permission เป็น 'user' โดยอัตโนมัติ
        const registrationData = {
            ...form.value,
            permission: 'user'
        }

        console.log('Registration data:', registrationData)

        await authStore.sendRegister(registrationData)

        success.value = 'Registration successful! Redirecting to login...'
        
        // รอสักครู่แล้วค่อย redirect
        setTimeout(() => {
            router.push('/login')
        }, 2000)

    } catch (err) {
        error.value = err.message || 'Registration failed. Please try again.'
        console.error('Registration error:', err)
    } finally {
        isLoading.value = false
    }
}

</script>