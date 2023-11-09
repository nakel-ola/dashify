import { formatErrorMessage } from "@/lib/format-error-message";

type ReturnType = {
  error?: {
    message: "NOT_FOUND" | "TOKEN_EXPIRED" | string;
  };
};

export async function validateEmail(
  token: string,
  accessToken: string
): Promise<ReturnType> {
  const res = await fetch(`${process.env.SERVER_URL}/auth/validate-email`, {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (res.status === 404) throw new Error("NOT_FOUND");

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
