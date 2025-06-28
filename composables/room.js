// composable/room.js
import service from "~/service";

export const useRooms = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const rooms = ref([]);

  const getRooms = async () => {
    try {
      const res = await service.room.getRooms(query.value);
      console.log("Full API Response Data:", res.data);

      const fetchedData = res.data.data;

      rooms.value = fetchedData.map((e) => ({
        id: e.id,
        name: e.name,
        has_password: e.has_password,
      }));

      console.log("Rooms updated:", rooms.value);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      rooms.value = [];
    }
  };

  return {
    rooms,
    getRooms,
  };
};
