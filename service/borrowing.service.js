import { client } from "./httpCilent";

export const fetchBorrowingRequests = (Query) => {
  return client({
    method: "get",
    url: "/borrowing/list",
    params: {
      ...Query,
    },
  });
};

export const fetchMyBorrowingRequests = (Query) => {
  return client({
    method: "get",
    url: "/borrowing/my-requests",
    params: {
      ...Query,
    },
  });
};

export const createBorrowingRequest = (payload) => {
  return client({
    method: "post",
    url: "/borrowing/create",
    data: payload,
  });
};

export const updateBorrowingStatus = (id, payload) => {
  return client({
    method: "patch",
    url: `/borrowing/${id}/status`,
    data: payload,
  });
};

export const deleteBorrowingRequest = (id) => {
  return client({
    method: "delete",
    url: `/borrowing/${id}`,
  });
};