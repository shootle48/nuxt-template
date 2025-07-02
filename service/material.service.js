import { client } from "./httpCilent";

export const fetchMaterials = (Query) => {
  return client({
    method: "get",
    url: "/material/list",
    params: {
      ...Query,
    },
  });
};

export const createMaterials = (payload) => {
  return client({
    method: "post",
    url: "/material/create",
    data: payload,
  });
};

export const updateMaterials = (payload, id) => {
  return client({
    method: "patch",
    url: `/material/${id}`,
    data: payload,
  });
};

export const deleteMaterials = (id) => {
  return client({
    method: "delete",
    url: `/material/${id}`,
  });
};
