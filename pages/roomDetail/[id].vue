<template>
    <div>
        hello from Room Details <div>
            {{ roomID }}
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const roomID = route.params.id
</script>
