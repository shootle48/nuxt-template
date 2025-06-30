import service from "../service";

export const useStudents = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });
  const students = ref([]);
  const isLoading = ref(false);

  const fetchStudents = async () => {
    isLoading.value = true;
    try {
      const res = await service.students.fetchStudents(query.value);
      console.log("Full API Response Data:", res.data.data);
      const fetchedData = res.data.data;
      students.value = fetchedData.map((item) => ({
        id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        student_number: item.student_number,
      }));
      console.log("students updated:", students.value);
    } catch (err) {
      console.error("Error fetching students:", err);
      students.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    students,
    isLoading,
    fetchStudents,
  };
};
