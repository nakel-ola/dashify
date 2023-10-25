import axios from "axios";

const refreshToken = async (token: string): Promise<string> => {
  const res = await axios.post(
    `${process.env.SERVER_URL!}/auth/refresh`,
    undefined,
    {
      headers: {
        "x-refresh-token": `Bearer ${token}`,
        origin: process.env.BASE_URL,
      },
    }
  );
  return res.data.accessToken;
};

export default refreshToken;
