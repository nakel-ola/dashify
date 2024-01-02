import { NextAuthOptions } from "next-auth";
import { isExpired } from "react-jwt";
import { LoginCredential } from "../../app/(auth)/auth/services/login-credential";
import { refreshToken } from "../../app/(auth)/auth/services/refresh-token";

export const nextAuthOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 3600 * 24 },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [LoginCredential],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === "update") return { ...token, ...session.user };
      if (!token.accessToken && token.refreshToken) {
        const accessToken = await refreshToken(token?.refreshToken as any);

        return { ...token, ...user, accessToken };
      }

      if (!isExpired((token as any).accessToken)) {
        return { ...token, ...user };
      } else {
        const accessToken = await refreshToken(token?.refreshToken as any);
        return { ...token, ...user, accessToken };
      }
    },
    async session({ session, token }: any) {
      session.user = token as any;

      return session;
    },
  },
};
