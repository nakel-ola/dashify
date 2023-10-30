import { nextAuthOptions } from "@/lib/auth/next-auth-options";
import nextAuth from "next-auth";

const handler = nextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
