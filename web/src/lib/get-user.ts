import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./auth/next-auth-options";

export async function getUser() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user;

  return user;
}
