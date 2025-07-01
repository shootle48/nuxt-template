import { client } from "./httpCilent";

export const fetchStudent = (Query) => {
  return client({
    method: "get",
    url: "/students/list",
    params: {
      ...Query,
    },
  });
};

export const createStudent = (payload) => {
  return client({
    method: "post",
    url: "/students/create",
    data: payload
  })
}

export const updateStudent = (payload, id) => {
  return client({
    method: 'patch',
    url: `/students/${id}`,
    data: payload
  })
}

export const deleteStudent = (id) => {
  return client({
    method: "delete",
    url: `/students/${id}`,
  })
}
