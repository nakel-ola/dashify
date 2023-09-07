import axios from "axios";
import { z } from "zod";

const fetchUser = async (token: string): Promise<UserType> => {
  try {
    const res = await axios.get<UserType>(`${process.env.SERVER_URL!}/users`, {
      headers: {
        "x-access-token": `Bearer ${token}`,
        origin: process.env.BASE_URL,
      },
    });

    const schema = z.object({
      uid: z.string().uuid(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      emailVerified: z.boolean(),
      updatedAt: z.string(),
      createdAt: z.string(),
    });

    const saveParse = schema.safeParse(res.data);

    if (!saveParse.success) throw new Error("Something went wrong");

    return saveParse.data as any;
  } catch (error: any) {
    console.log(error.message);
    const errorMsgs = error.response.errors
      .map((err: any) => err.message)
      .join(",");
    throw new Error(errorMsgs);
  }
};

export default fetchUser;
