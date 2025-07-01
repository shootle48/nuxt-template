<!-- pages/login.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <form @submit.prevent="onLogin" class="bg-white p-8 rounded shadow-md w-full max-w-md space-y-5">
            <h2 class="text-2xl font-semibold text-center">Login</h2>

            <div class="flex flex-col">
                <label for="email" class="mb-1 text-sm font-medium text-gray-700">Student Number</label>
                <input id="email" v-model="form.student_number" type="text" required
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
            <NuxtLink to="/register">
                Register?
            </NuxtLink>
        </form>
    </div>
</template>

<script setup>
const form = ref({
    student_number: '',
    password: '',
})

const error = ref('')
const isLoading = ref(false)

const router = useRouter()
const { sendAuth } = useAuth()

const onLogin = async () => {
    error.value = ''
    isLoading.value = true

    const result = await sendAuth(form.value)

    isLoading.value = false

    if (result.success) {
        const token = result.token // รับ token จาก result
        const cookie = useCookie('token')
        cookie.value = token

        router.push('/')
    } else {
        error.value = 'Invalid email or password'
    }
}
</script>
