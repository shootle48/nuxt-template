import { client } from "./httpCilent";

export const getProductList = (Query) => {
  return client({
    method: "get",
    url: "/products",
    params: {
      ...Query,
    },
  });
};

export const getProductDetail = (id) => {
  return client({
    method: "get",
    url: `/products/${id}`,
  });
};

export const createProduct = (payload) => {
  return client({
    method: "post",
    url: "/products",
    data: payload,
  });
};

export const updateProduct = (id, payload) => {
  return client({
    url: `/products/${id}`,
    method: "patch",
    data: payload,
  });
};

export const deleteProduct = (id) => {
  return client({
    url: `/products/${id}`,
    method: "delete",
  });
};

export const getRooms = (Query) => {
  return client({
    method: "get",
    url: "/rooms/list",
    params: {
      ...Query,
    },
  });
};
