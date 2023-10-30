import CredentialsProvider from "next-auth/providers/credentials";
import { decodeToken } from "react-jwt";
import { formatErrorMessage } from "../../../../lib/format-error-message";
import { fetchUser } from "./fetch-user";

type Input = {
  email: string;
  password: string;
};
type DecodedData = {
  sub: string;
  email: string;
  emailVerified: boolean;
};

type Credentials = Record<keyof Input, any>;

export const LoginCredential = CredentialsProvider<Credentials>({
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: {},
    password: {},
  },
  authorize: async (credentials) => {
    try {
      if (!credentials) throw new Error("Credentials Required");
      const response = await fetch(`${process.env.SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data.message));

      const decodedToken = decodeToken<DecodedData>(data.accessToken);

      if (!decodedToken) throw new Error("Something went wrong");

      const user = await fetchUser(data.accessToken);

      return {
        id: decodedToken.sub,
        uid: decodedToken.sub,
        email: decodedToken.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: decodedToken.emailVerified,
        photoUrl: user.photoUrl,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
});
