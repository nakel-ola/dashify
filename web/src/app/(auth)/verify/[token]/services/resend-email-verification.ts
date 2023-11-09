import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

export async function resendEmailVerification(accessToken: string) {
  const res = await fetch(
    `${process.env.SERVER_URL}/auth/resend-email-verification`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
