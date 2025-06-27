import { client } from "./httpCilent";

export const getRooms = (Query) => {
  return client({
    method: "get",
    url: "/rooms/list",
    params: {
      ...Query,
    },
  });
};
