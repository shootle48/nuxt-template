<template>
  <div class="p-6">
    <Equipment />
  </div>
</template>

<script setup>
import Equipment from '../../components/Equipment.vue'

definePageMeta({
  title: 'Equipment Management',
  middleware: ['auth', 'admin'],
  layout: 'admin',
  requiresAuth: true
})
</script>