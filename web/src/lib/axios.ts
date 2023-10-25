import ax from "axios";
import { getSession } from "next-auth/react";

const axios = ax.create({
  baseURL: process.env.SERVER_URL,
});

axios.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const accessToken = session ? session?.user.accessToken : null;

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
