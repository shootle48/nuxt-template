import service from "../service";
import { ref } from "vue";

export const useBorrowing = () => {
  const query = ref({
    page: 1,
    limit: 50,
  });

  const borrowingRequests = ref([]);
  const myBorrowingRequests = ref([]);
  const isLoading = ref(false);

  const fetchBorrowingRequests = async () => {
    isLoading.value = true;
    try {
      const res = await service.borrowing.fetchBorrowingRequests(query.value);
      console.log("Full API Response Data:", res.data);
      const fetchedData = res.data.data;
      borrowingRequests.value = fetchedData.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        item_name: item.item_name,
        item_type: item.item_type,
        borrower_id: item.borrower_id,
        borrower_name: item.borrower_name,
        student_id: item.student_id,
        purpose: item.purpose,
        duration: item.duration,
        quantity: item.quantity || 1,
        notes: item.notes,
        admin_notes: item.admin_notes,
        status: item.status,
        created_at: item.created_at,
        approved_at: item.approved_at,
        rejected_at: item.rejected_at,
      }));
      console.log("Borrowing requests updated:", borrowingRequests.value);
    } catch (err) {
      console.error("Error fetching borrowing requests:", err);
      borrowingRequests.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMyBorrowingRequests = async () => {
    isLoading.value = true;
    try {
      const res = await service.borrowing.fetchMyBorrowingRequests(query.value);
      console.log("My borrowing requests:", res.data);
      const fetchedData = res.data.data;
      myBorrowingRequests.value = fetchedData.map((item) => ({
        id: item.id,
        item_id: item.item_id,
        item_name: item.item_name,
        item_type: item.item_type,
        borrower_id: item.borrower_id,
        borrower_name: item.borrower_name,
        student_id: item.student_id,
        purpose: item.purpose,
        duration: item.duration,
        quantity: item.quantity || 1,
        notes: item.notes,
        admin_notes: item.admin_notes,
        status: item.status,
        created_at: item.created_at,
        approved_at: item.approved_at,
        rejected_at: item.rejected_at,
      }));
      console.log("My borrowing requests updated:", myBorrowingRequests.value);
    } catch (err) {
      console.error("Error fetching my borrowing requests:", err);
      myBorrowingRequests.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const createBorrowingRequest = async (payload) => {
    try {
      await service.borrowing.createBorrowingRequest(payload);
      console.log("Create borrowing request successfully!");
      return true;
    } catch (err) {
      console.error("Error creating borrowing request:", err);
      return false;
    }
  };

  const updateBorrowingStatus = async (id, status, adminNotes = '') => {
    try {
      await service.borrowing.updateBorrowingStatus(id, { status, admin_notes: adminNotes });
      console.log("Update borrowing status successfully!");
      return true;
    } catch (err) {
      console.error("Error updating borrowing status:", err);
      return false;
    }
  };

  const deleteBorrowingRequest = async (id) => {
    try {
      await service.borrowing.deleteBorrowingRequest(id);
      console.log("Delete borrowing request successfully!");
      await fetchBorrowingRequests();
    } catch (err) {
      console.error("Error deleting borrowing request", err);
      return false;
    }
  };

  return {
    borrowingRequests,
    myBorrowingRequests,
    isLoading,
    fetchBorrowingRequests,
    fetchMyBorrowingRequests,
    createBorrowingRequest,
    updateBorrowingStatus,
    deleteBorrowingRequest,
  };
};