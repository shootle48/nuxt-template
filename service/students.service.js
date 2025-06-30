import { client } from "./httpCilent";

export const fetchStudents = (Query) => {
  return client({
    method: "get",
    url: "/students/list",
    params: {
      ...Query,
    },
  });
};
