import axios from "axios";

export const client = (ops) => {
  const config = useRuntimeConfig();

  let api = axios.create();

  api.defaults.baseURL = config.public.API_BASE;
  api.defaults.headers.common["Content-Type"] = "application/json";

  api.defaults.validateStatus = false;
  ops.method = ops.method.toLowerCase();

  return api({
    ...ops,
  });
};
