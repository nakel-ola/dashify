"use server";

import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

export async function deleteAccount() {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const res = await fetch(`${process.env.SERVER_URL}/auth/delete-account`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));
  return data;
}
