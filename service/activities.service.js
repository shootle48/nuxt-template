import { client } from "./httpCilent";

export const fetchActivities = (Query) => {
  return client({
    method: "get",
    url: "/activities/list",
    params: {
      ...Query,
    },
  });
};

export const createActivities = (payload) => {
  return client({
    method: "post",
    url: "/activities/create",
    data: payload
  })
}

export const updateActivities = (payload, id) => {
  return client({
    method: 'patch',
    url: `/activities/${id}`,
    data: payload
  })
}

export const deleteActivities = (id) => {
  return client({
    method: "delete",
    url: `/activities/${id}`,
  })
}
