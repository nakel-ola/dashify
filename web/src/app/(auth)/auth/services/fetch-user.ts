export async function fetchUser(token: string) {
  try {
    const res = await fetch(`${process.env.SERVER_URL!}/users`, {
      headers: {
        "x-access-token": `Bearer ${token}`,
        origin: process.env.BASE_URL!,
      },
    });

    const data = await res.json() as UserType;

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
