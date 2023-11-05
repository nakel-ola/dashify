import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./auth/next-auth-options";

export async function getAccessToken() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) return null;

  return session.user.accessToken;
}
