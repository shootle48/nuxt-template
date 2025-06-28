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
  const getMockRooms = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    rooms.value = [
      { id: 1, room_number: "101", floor: 1, price: 1200, bed_type: "Single" },
      { id: 2, room_number: "202", floor: 2, price: 1500, bed_type: "Double" },
      { id: 3, room_number: "303", floor: 3, price: 1700, bed_type: "Double" },
      { id: 4, room_number: "404", floor: 4, price: 2000, bed_type: "Single" },
      { id: 5, room_number: "505", floor: 5, price: 2500, bed_type: "Double" },
      { id: 6, room_number: "606", floor: 6, price: 3000, bed_type: "Single" },
    ];
  };

  return {
    rooms,
    getRooms,
    getMockRooms,
  };
};
