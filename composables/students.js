import service from "../service";
import { ref } from "vue";

export const useStudents = () => {
  const query = ref({
    page: 1,
    limit: 100,
  });

  const activities = ref([]);
  const isLoading = ref(false);
  
  const fetchStudents = async () => {
    isLoading.value = true;
    try {
      const res = await service.activities.fetchStudents(query.value);
      console.log("Full API Response Data:", res.data);

      const fetchedData = res.data.data;

      activities.value = fetchedData.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        create_at: item.create_at,
      }));

      console.log("activities updated:", activities.value);
    } catch (err) {
      console.error("Error fetching activities:", err);
      activities.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const createStudents = async (payload) => {
    try {
      await service.activities.createStudents(payload);
      console.log("create activities successfully!");
      await fetchActivities();
      return true;
    } catch (err) {
      console.error("Error creating activities:", err);
      return false;
    }
  };

  const updateStudents = async (payload, id) => {
    try {
      await service.activities.updateStudents(payload, id);
      console.log("update activities successfully!");
      return true;
    } catch (err) {
      console.error("Error Updating activities:", err);
      return false;
    }
  };

  const deleteStudents = async (id) => {
    try {
      await service.activities.deleteStudents(id);
      console.log("delete activities successfully!");
      await fetchStudents();
    } catch (err) {
      console.error("Error Deleting activities", err);
      return false;
    }
  };

  return {
    activities,
    isLoading, // ✅ export loading
    fetchStudents,
    createStudents,
    updateStudents,
    deleteStudents,
  };
};
