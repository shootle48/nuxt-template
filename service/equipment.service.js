import { client } from "./httpCilent";

export const fetchEquipments = (Query) => {
  return client({
    method: "get",
    url: "/equipment/list",
    params: {
      ...Query,
    },
  });
};

export const createEquipments = (payload) => {
  return client({
    method: "post",
    url: "/equipment/create",
    data: payload,
  });
};

export const updateEquipments = (payload, id) => {
  return client({
    method: "patch",
    url: `/equipment/${id}`,
    data: payload,
  });
};

export const deleteEquipments = (id) => {
  return client({
    method: "delete",
    url: `/equipment/${id}`,
  });
};
