    <script setup>

    const roomsStore = useRooms();
    const rooms = roomsStore.rooms;

    onMounted(async () => {
        console.log("room loaded!");
        await roomsStore.getRooms();
    });
</script>
    <template>
        <div>
            Hello from first page!
            <ul>
                <li v-for="(room, i) in rooms" :key="i">
                    <div>
                        {{ room.id }}
                    </div>
                    <div>
                        {{ room.name }}
                    </div>
                </li>
            </ul>
        </div>
    </template>
