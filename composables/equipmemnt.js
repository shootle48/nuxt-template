import service from "../service";
import { ref } from "vue";

export const useEquipments = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const equipments = ref([]);
  const isLoading = ref(false);

  const fetchEquipments = async () => {
    isLoading.value = true;
    try {
      const res = await service.equipmemnt.fetchEquipments(query.value);
      console.log("Full API Response Data:", res.data);
      const fetchedData = res.data.data;
      equipments.value = fetchedData.map((item) => ({
        id: item.id,
        asset_number: item.asset_number,
        name: item.name,
        registered_year: item.registered_year,
        type: item.type,
        location: item.location,
        condition: item.condition,
        status: item.status,
        created_at: item.created_at,
      }));
      console.log("Equipments updated:", equipments.value);
    } catch (err) {
      console.error("Error fetching Equipments:", err);
      equipments.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const createEquipments = async (payload) => {
    try {
      await service.equipmemnt.createEquipments(payload);
      console.log("create Equipments successfully!");
      await fetchEquipments();
      return true;
    } catch (err) {
      console.error("Error creating Equipments:", err);
      return false;
    }
  };

  const updateEquipments = async (payload, id) => {
    try {
      await service.equipmemnt.updateEquipments(payload, id);
      console.log("update Equipments successfully!");
      return true;
    } catch (err) {
      console.error("Error Updating Equipments:", err);
      return false;
    }
  };

  const deleteEquipments = async (id) => {
    try {
      await service.equipmemnt.deleteEquipments(id);
      console.log("delete Equipments successfully!");
      await fetchEquipments();
    } catch (err) {
      console.error("Error Deleting Equipments", err);
      return false;
    }
  };

  return {
    equipments,
    isLoading,
    fetchEquipments,
    createEquipments,
    updateEquipments,
    deleteEquipments,
  };
};