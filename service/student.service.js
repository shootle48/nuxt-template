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

export const createStudents = (payload) => {
  return client({
    method: "post",
    url: "/students/create",
    data: payload
  })
}

export const updateStudents = (payload, id) => {
  return client({
    method: 'patch',
    url: `/students/${id}`,
    data: payload
  })
}

export const deleteStudents = (id) => {
  return client({
    method: "delete",
    url: `/students/delete/${id}`,
  })
}
