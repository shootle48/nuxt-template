// composable/room.js
import service from "~/service";

export const useRooms = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const rooms = ref([]);
  const loading = ref(false);

  const getRooms = async () => {
    loading.value = true;
    try {
      const res = await service.room.getRooms(query.value);
      console.log("Full API Response Data:", res.data);

      const fetchedData = res.data.data;

      if (Array.isArray(fetchedData)) {
        rooms.value = fetchedData.map((e) => ({
          id: e.id,
          name: e.name,
          hash_password: e.hash_password,
        }));
        console.log("Rooms updated:", rooms.value);
      } else {
        console.warn("API response 'data.data' is not an array:", fetchedData);
        rooms.value = [];
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      rooms.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    rooms,
    getRooms,
    loading,
  };
};
