<script setup>
import Card from '~/components/Card.vue';
import { useStudents } from '../composables/students';
const studentsStore = useStudents()
const students = studentsStore.students
const isLoading = studentsStore.isLoading;

onMounted(async () => {
    await studentsStore.fetchStudents()
})

</script>
<template>
    <div class="flex flex-col items-center justify-center">
        Hello from first page!
        <div v-for="student in students" :key="student.id" class="bg-rose-500 text-white">
            {{ student.first_name }} {{ student.last_name }}
            {{ student.student_number }}
        </div>
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
            <div v-for="n in 3" :key="n" class="bg-gray-300 rounded-xl p-6 animate-pulse h-48"></div>
        </div>
        <Card />
    </div>
</template>
