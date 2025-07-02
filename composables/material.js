import service from "../service";
import { ref } from "vue";

export const useMaterials = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const materials = ref([]);
  const isLoading = ref(false);

  const fetchMaterials = async () => {
    isLoading.value = true;
    try {
      const res = await service.material.fetchMaterials(query.value);
      console.log("Full API Response Data:", res.data);
      const fetchedData = res.data.data;
      materials.value = fetchedData.map((item) => ({
        id: item.id,
        material_number: item.material_number,
        name: item.name,
        purchase_date: item.purchase_date,
        type: item.type,
        quantity: item.quantity,
        location: item.location,
        created_at: item.created_at,
      }));
      console.log("Materials updated:", materials.value);
    } catch (err) {
      console.error("Error fetching Materials:", err);
      materials.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const createMaterials = async (payload) => {
    try {
      await service.material.createMaterials(payload);
      console.log("create Materials successfully!");
      await fetchMaterials();
      return true;
    } catch (err) {
      console.error("Error creating Materials:", err);
      return false;
    }
  };

  const updateMaterials = async (payload, id) => {
    try {
      await service.material.updateMaterials(payload, id);
      console.log("update Materials successfully!");
      return true;
    } catch (err) {
      console.error("Error Updating Materials:", err);
      return false;
    }
  };

  const deleteMaterials = async (id) => {
    try {
      await service.material.deleteMaterials(id);
      console.log("delete Materials successfully!");
      await fetchMaterials();
    } catch (err) {
      console.error("Error Deleting Materials", err);
      return false;
    }
  };

  return {
    materials,
    isLoading,
    fetchMaterials,
    createMaterials,
    updateMaterials,
    deleteMaterials,
  };
};