import axios from "axios";
import { Awaitable, User } from "next-auth";
import { z } from "zod";
import fetchUser from "./fetchUser";
import { Req } from "./loginAuthorize";

type Credentials = Record<never, string> | undefined;
type SigninAuthorize = (
  credentials: Credentials,
  req: Req
) => Awaitable<User | null>;

const changePasswordAuthorize: SigninAuthorize = async (credentials) => {
  try {
    const schema = z.object({
      email: z
        .string({
          required_error: "Email address must be provided",
        })
        .email(),
      verificationCode: z.string().length(21),
      password: z
        .string({
          required_error: "Password must be provided",
        })
        .min(8, "Password must be at least 8 characters"),
    });

    const saveParse = schema.parse(credentials);

    const res = await axios.post(
      `${process.env.SERVER_URL}/auth/change_password`,
      saveParse,
      {
        headers: {
          origin: process.env.BASE_URL,
        },
      }
    );

    const user = await fetchUser(res.data.accessToken);

    return {
      id: user.uid,
      ...user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    };
  } catch (error: any) {
    const errorMsgs = error.response.data.message;
    throw new Error(errorMsgs);
  }
};

export default changePasswordAuthorize;
