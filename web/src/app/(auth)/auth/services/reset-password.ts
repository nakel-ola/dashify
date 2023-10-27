import { formatErrorMessage } from "@/lib/format-error-message";

export async function resetPassword(email: string) {
  const res = await fetch(`${process.env.SERVER_URL}/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
