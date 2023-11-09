import ax from "axios";
import { getAccessToken } from "./get-access-token";

const axios = ax.create({
  baseURL: process.env.SERVER_URL,
});

axios.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken && config.headers) {
      config.headers["x-access-token"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
