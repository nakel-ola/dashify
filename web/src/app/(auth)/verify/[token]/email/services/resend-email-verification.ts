import { nextAuthOptions } from "@/lib/auth/next-auth-options";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getServerSession } from "next-auth";

export async function resendEmailVerification() {
  const session = await getServerSession(nextAuthOptions);

  const accessToken = session?.user.accessToken;

  if (!accessToken) throw new Error("Please login");

  const res = await fetch(
    `${process.env.SERVER_URL}/auth/resend-email-verification`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": accessToken,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
