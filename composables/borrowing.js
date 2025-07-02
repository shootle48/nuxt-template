import service from "../service";
import { ref } from "vue";

export const useBorrowing = () => {
  const query = ref({
    page: 1,
    limit: 50,
  });

  const equipmentBorrowRecords = ref([]);
  const materialBorrowRecords = ref([]);
  const myEquipmentBorrowRecords = ref([]);
  const myMaterialBorrowRecords = ref([]);
  const isLoading = ref(false);

  // Admin functions - fetch all records
  const fetchEquipmentBorrowRecords = async () => {
    isLoading.value = true;
    try {
      const res = await service.borrowing.fetchEquipmentBorrowRecords(query.value);
      console.log("Equipment borrow records:", res.data);
      const fetchedData = res.data.data || res.data;
      equipmentBorrowRecords.value = fetchedData.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        equipment_id: item.equipment_id,
        admin_id: item.admin_id,
        borrow_date: item.borrow_date,
        return_due: item.return_due,
        returned: item.returned,
        created_at: item.created_at,
        // Additional fields for display
        user_name: item.user_name,
        equipment_name: item.equipment_name,
        admin_name: item.admin_name,
      }));
    } catch (err) {
      console.error("Error fetching equipment borrow records:", err);
      equipmentBorrowRecords.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMaterialBorrowRecords = async () => {
    isLoading.value = true;
    try {
      const res = await service.borrowing.fetchMaterialBorrowRecords(query.value);
      console.log("Material borrow records:", res.data);
      const fetchedData = res.data.data || res.data;
      materialBorrowRecords.value = fetchedData.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        material_id: item.material_id,
        admin_id: item.admin_id,
        borrow_date: item.borrow_date,
        return_due: item.return_due,
        returned: item.returned,
        created_at: item.created_at,
        // Additional fields for display
        user_name: item.user_name,
        material_name: item.material_name,
        admin_name: item.admin_name,
      }));
    } catch (err) {
      console.error("Error fetching material borrow records:", err);
      materialBorrowRecords.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // User functions - fetch own records
  const fetchMyEquipmentBorrowRecords = async () => {
    isLoading.value = true;
    try {
      const res = await service.borrowing.fetchMyEquipmentBorrowRecords(query.value);
      console.log("My equipment borrow records:", res.data);
      const fetchedData = res.data.data || res.data;
      myEquipmentBorrowRecords.value = fetchedData.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        equipment_id: item.equipment_id,
        admin_id: item.admin_id,
        borrow_date: item.borrow_date,
        return_due: item.return_due,
        returned: item.returned,
        created_at: item.created_at,
        equipment_name: item.equipment_name,
        admin_name: item.admin_name,
      }));
    } catch (err) {
      console.error("Error fetching my equipment borrow records:", err);
      myEquipmentBorrowRecords.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMyMaterialBorrowRecords = async () => {
    isLoading.value = true;
    try {
      const res = await service.borrowing.fetchMyMaterialBorrowRecords(query.value);
      console.log("My material borrow records:", res.data);
      const fetchedData = res.data.data || res.data;
      myMaterialBorrowRecords.value = fetchedData.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        material_id: item.material_id,
        admin_id: item.admin_id,
        borrow_date: item.borrow_date,
        return_due: item.return_due,
        returned: item.returned,
        created_at: item.created_at,
        material_name: item.material_name,
        admin_name: item.admin_name,
      }));
    } catch (err) {
      console.error("Error fetching my material borrow records:", err);
      myMaterialBorrowRecords.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Create borrow records
  const createEquipmentBorrowRecord = async (payload) => {
    try {
      await service.borrowing.createEquipmentBorrowRecord(payload);
      console.log("Create equipment borrow record successfully!");
      return true;
    } catch (err) {
      console.error("Error creating equipment borrow record:", err);
      return false;
    }
  };

  const createMaterialBorrowRecord = async (payload) => {
    try {
      await service.borrowing.createMaterialBorrowRecord(payload);
      console.log("Create material borrow record successfully!");
      return true;
    } catch (err) {
      console.error("Error creating material borrow record:", err);
      return false;
    }
  };

  // Update borrow records
  const updateEquipmentBorrowRecord = async (payload, id) => {
    try {
      await service.borrowing.updateEquipmentBorrowRecord(payload, id);
      console.log("Update equipment borrow record successfully!");
      return true;
    } catch (err) {
      console.error("Error updating equipment borrow record:", err);
      return false;
    }
  };

  const updateMaterialBorrowRecord = async (payload, id) => {
    try {
      await service.borrowing.updateMaterialBorrowRecord(payload, id);
      console.log("Update material borrow record successfully!");
      return true;
    } catch (err) {
      console.error("Error updating material borrow record:", err);
      return false;
    }
  };

  // Delete borrow records
  const deleteEquipmentBorrowRecord = async (id) => {
    try {
      await service.borrowing.deleteEquipmentBorrowRecord(id);
      console.log("Delete equipment borrow record successfully!");
      await fetchEquipmentBorrowRecords();
    } catch (err) {
      console.error("Error deleting equipment borrow record", err);
      return false;
    }
  };

  const deleteMaterialBorrowRecord = async (id) => {
    try {
      await service.borrowing.deleteMaterialBorrowRecord(id);
      console.log("Delete material borrow record successfully!");
      await fetchMaterialBorrowRecords();
    } catch (err) {
      console.error("Error deleting material borrow record", err);
      return false;
    }
  };

  return {
    // State
    equipmentBorrowRecords,
    materialBorrowRecords,
    myEquipmentBorrowRecords,
    myMaterialBorrowRecords,
    isLoading,

    // Admin functions
    fetchEquipmentBorrowRecords,
    fetchMaterialBorrowRecords,
    createEquipmentBorrowRecord,
    createMaterialBorrowRecord,
    updateEquipmentBorrowRecord,
    updateMaterialBorrowRecord,
    deleteEquipmentBorrowRecord,
    deleteMaterialBorrowRecord,

    // User functions
    fetchMyEquipmentBorrowRecords,
    fetchMyMaterialBorrowRecords,
  };
};