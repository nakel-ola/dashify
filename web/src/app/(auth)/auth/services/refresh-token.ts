export const refreshToken = async (token: string): Promise<string> => {
  try {
    const res = await fetch(`${process.env.SERVER_URL!}/auth/refresh`, {
      headers: {
        "x-refresh-token": `Bearer ${token}`,
        origin: process.env.BASE_URL!,
      },
    });

    const data = await res.json();

    return data.accessToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
