<template>
  <div class="p-6">
    <Material />
  </div>
</template>

<script setup>
import Material from '../../components/Material.vue'

definePageMeta({
  title: 'Material Management',
  middleware: ['auth', 'admin'],
  layout: 'admin',
  requiresAuth: true
})
</script>