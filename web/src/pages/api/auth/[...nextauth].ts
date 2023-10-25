import changePasswordAuthorize from "@/services/changePasswordAuthorize";
import loginAuthorize from "@/services/loginAuthorize";
import refreshToken from "@/services/refreshToken";
import registerAuthorize from "@/services/registerAuthorize";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { isExpired } from "react-jwt";

const Login = CredentialsProvider({
  id: "login",
  name: "Credentials",
  type: "credentials",
  credentials: {},
  authorize: loginAuthorize,
});

const Register = CredentialsProvider({
  id: "register",
  name: "Credentials",
  type: "credentials",
  credentials: {},
  authorize: registerAuthorize,
});

const ChangePassword = CredentialsProvider({
  id: "change_password",
  name: "Credentials",
  type: "credentials",
  credentials: {},
  authorize: changePasswordAuthorize,
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [Register, Login, ChangePassword],
  callbacks: {
    async jwt({ token, user }) {
      if (!token.accessToken) return { ...token, ...user };

      if (!isExpired((token as any).accessToken)) {
        return { ...token, ...user };
      } else {
        const accessToken = await refreshToken(token?.refreshToken as any);
        return { ...token, ...user, accessToken };
      }
    },

    async session({ session, token }) {
      session.user = token as any;

      return session;
    },
  },
};
export default NextAuth(authOptions);
