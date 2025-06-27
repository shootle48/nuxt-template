<script setup>

const roomsStore = useProduct();
const rooms = roomsStore.rooms;

onMounted(async () => {
    console.log("room loaded!");
    await roomsStore.getRooms(); // เรียกฟังก์ชันจริง
});
</script>
<template>
    <div>
        Hello from first page!
        <ul>
            <li v-for="(room, i) in rooms" :key="i">
                {{ room.name }}
            </li>
        </ul>
    </div>
</template>
