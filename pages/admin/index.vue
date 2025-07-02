<template>
  <div>
    <Equipment />
    <Material />
  </div>
</template>

<script setup>

import Equipment from '../../components/Equipment.vue';
import Material from '../../components/Material.vue';
definePageMeta({
  title: 'Material Page',
  middleware: ['auth'],
  layout: 'admin',
  requiresAuth: true
})
</script>
