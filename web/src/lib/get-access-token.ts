import { getServerSession, type Session } from "next-auth";
import { getSession } from "next-auth/react";
import { nextAuthOptions } from "./auth/next-auth-options";

export async function getAccessToken() {
  let session: Session | null = null;

  if (typeof window === "undefined") {
    session = await getServerSession(nextAuthOptions);
  } else {
    session = await getSession();
  }

  if (!session) return null;

  return session.user.accessToken;
}
