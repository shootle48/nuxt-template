<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <form @submit.prevent="onLogin" class="bg-white p-8 rounded shadow-md w-full max-w-md space-y-5">
            <h2 class="text-2xl font-semibold text-center">Login</h2>

            <div class="flex flex-col">
                <label for="email" class="mb-1 text-sm font-medium text-gray-700">Email</label>
                <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    required
                    placeholder="Enter your email"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                />
            </div>

            <div class="flex flex-col">
                <label for="password" class="mb-1 text-sm font-medium text-gray-700">Password</label>
                <input 
                    id="password" 
                    v-model="form.password" 
                    type="password" 
                    required 
                    placeholder="Enter your password"
                    class="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                />
            </div>

            <div v-if="error" class="text-red-600 text-sm text-center">{{ error }}</div>
            <div v-if="success" class="text-green-600 text-sm text-center">{{ success }}</div>

            <button 
                type="submit" 
                :disabled="isLoading"
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ isLoading ? "Logging in..." : "Login" }}
            </button>

            <div class="text-center">
                <p class="text-sm text-gray-600">
                    Don't have an account? 
                    <NuxtLink to="/register" class="text-green-500 hover:text-green-600 font-medium">
                        Register here
                    </NuxtLink>
                </p>
            </div>

            <!-- Debug Info (เอาออกใน production) -->
            <div v-if="process.dev" class="mt-4 p-3 bg-gray-100 rounded text-xs">
                <p><strong>Debug Info:</strong></p>
                <p>Form: {{ JSON.stringify(form) }}</p>
                <p>Loading: {{ isLoading }}</p>
            </div>
        </form>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'guest'
});

const form = ref({
    email: '',
    password: '',
});

const error = ref('');
const success = ref('');

const router = useRouter();
const { sendAuth, isLoading, getRedirectPath } = useAuth();

const onLogin = async () => {
    try {
        error.value = '';
        success.value = '';

        if (!form.value.email || !form.value.password) {
            error.value = 'Please fill in all required fields';
            return;
        }

        console.log('Attempting login with:', { email: form.value.email });

        const result = await sendAuth(form.value);

        if (result.success) {
            success.value = 'Login successful! Redirecting...';
            console.log('Login successful, user:', result.user);

            const redirectPath = getRedirectPath(result.user?.permission || result.user?.role);
            console.log('Redirecting to:', redirectPath);

            // รอสักครู่แล้วค่อย redirect
            setTimeout(() => {
                router.push(redirectPath);
            }, 1500);

        } else {
            error.value = result.message || 'Invalid email or password';
        }

    } catch (err) {
        console.error('Login error:', err);
        error.value = 'An unexpected error occurred. Please try again.';
    }
};
</script>