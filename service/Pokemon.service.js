import { client } from "./httpCilent";

export const fetchPokemons = (query) => {
  const config = useRuntimeConfig();
  const offset = (query.page - 1) * query.limit;

  return client({
    method: "get",
    url: "/pokemon",
    baseURL: config.public.POKEMON_API_BASE, // เพิ่มบรรทัดนี้
    params: {
      offset,
      limit: query.limit,
    },
  });
};
