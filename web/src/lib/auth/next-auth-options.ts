import { NextAuthOptions } from 'next-auth';
import { isExpired, decodeToken } from 'react-jwt';
import { type DecodedData, LoginCredential } from '../../app/(auth)/auth/services/login-credential';
import { refreshToken } from '../../app/(auth)/auth/services/refresh-token';
import { GoogleAuthProvider } from '@/app/(auth)/auth/services/google-auth-provider';
import { signInProvider } from '@/app/(auth)/auth/services/sign-in-provider';


export const nextAuthOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 3600 * 24 },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [GoogleAuthProvider, LoginCredential],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (trigger === 'update') return { ...token, ...session.user };
      if (!token.accessToken && token.refreshToken) {
        const accessToken = await refreshToken(token?.refreshToken as any);

        return { ...token, ...user, accessToken };
      }

      if (token.accessToken && !isExpired(token.accessToken)) {
        return { ...token, ...user };
      } else if (token?.refreshToken) {
        const accessToken = await refreshToken(token?.refreshToken as any);
        return { ...token, ...user, accessToken };
      }

      return { ...token, ...user };
    },
    async session({ session, token }: any) {
      session.user = token as any;

      return session;
    },
    async signIn({ account, profile, user }: any) {
      if (account && profile) {
        if (account.provider === 'google') {
          const res = await signInProvider({
            email: profile.email!,
            firstName: profile.given_name,
            lastName: profile.family_name,
            emailVerified: profile.email_verified,
            provider: 'GOOGLE',
            idToken: account.id_token,
          });

          const decodedToken = decodeToken<DecodedData>(res.accessToken);

          if (!decodedToken) throw new Error('Something went wrong');

          user.id = decodedToken.sub;
          user.uid = decodedToken.sub;
          user.email = decodedToken.email;
          user.emailVerified = decodedToken.emailVerified;
          user.accessToken = res.accessToken;
          user.refreshToken = res.refreshToken;
        }

        if (account.provider === 'apple') {
        }
      }

      return true;
    },
  },
};
