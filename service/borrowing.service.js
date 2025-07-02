import { client } from "./httpCilent";

// Equipment Borrowing
export const fetchEquipmentBorrowRecords = (Query) => {
  return client({
    method: "get",
    url: "/equipment_borrow_record/list",
    params: {
      ...Query,
    },
  });
};

export const createEquipmentBorrowRecord = (payload) => {
  return client({
    method: "post",
    url: "/equipment_borrow_record/create",
    data: payload,
  });
};

export const updateEquipmentBorrowRecord = (payload, id) => {
  return client({
    method: "patch",
    url: `/equipment_borrow_record/${id}`,
    data: payload,
  });
};

export const deleteEquipmentBorrowRecord = (id) => {
  return client({
    method: "delete",
    url: `/equipment_borrow_record/${id}`,
  });
};

// Material Borrowing
export const fetchMaterialBorrowRecords = (Query) => {
  return client({
    method: "get",
    url: "/material_borrow_record/list",
    params: {
      ...Query,
    },
  });
};

export const createMaterialBorrowRecord = (payload) => {
  return client({
    method: "post",
    url: "/material_borrow_record/create",
    data: payload,
  });
};

export const updateMaterialBorrowRecord = (payload, id) => {
  return client({
    method: "patch",
    url: `/material_borrow_record/${id}`,
    data: payload,
  });
};

export const deleteMaterialBorrowRecord = (id) => {
  return client({
    method: "delete",
    url: `/material_borrow_record/${id}`,
  });
};

// User's own borrowing records
export const fetchMyEquipmentBorrowRecords = (Query) => {
  return client({
    method: "get",
    url: "/equipment_borrow_record/my",
    params: {
      ...Query,
    },
  });
};

export const fetchMyMaterialBorrowRecords = (Query) => {
  return client({
    method: "get",
    url: "/material_borrow_record/my",
    params: {
      ...Query,
    },
  });
};