<script setup>

const roomsStore = useRooms();
const rooms = roomsStore.rooms;

onMounted(async () => {
  console.log("room loaded!");
  await roomsStore.getMockRooms();
});
</script>

<template>

  <div class="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Available Rooms</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      <div v-for="room in rooms" :key="room.id"
        class="bg-rose-500 rounded-xl p-6 text-white flex flex-col items-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex flex-col items-center">
          <div class="text-xl font-semibold mb-2">
            Room ID: {{ room.id }}
          </div>
          <div class="text-3xl font-extrabold">
            {{ room.room_number }}
          </div>
          <div class="text-3xl font-extrabold">
            {{ room.floor }}
          </div>
          <div class="text-3xl font-extrabold">
            {{ room.price }}
          </div>
          <div class="text-3xl font-extrabold">
            {{ room.bed_type }}
          </div>

        </div>
        <div>
          <NuxtLink :to="`/roomDetail/${room.id}`">
            <button
              class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75">
              View Detail
            </button>
          </NuxtLink>
        </div>
      </div>

      <p v-if="rooms.length === 0" class="col-span-full text-center text-gray-600 text-lg">
        No rooms found.
      </p>
    </div>
  </div>
</template>
