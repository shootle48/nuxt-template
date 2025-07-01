<script setup>
import Card from '../components/Card.vue'
// import Pokemon from '../components/Pokemon.vue'

definePageMeta({
  title: 'First Page',
  middleware: ['auth'], // เรียกใช้ middleware ชื่อ 'auth'
  layout: 'default',    // หรือ custom layout ถ้ามี
  requiresAuth: true    // custom field ได้เช่นกัน
})
</script>

<template>
  <div>
    Hello from first page!
    <Card />
    <!-- <Pokemon/> -->
  </div>
</template>
