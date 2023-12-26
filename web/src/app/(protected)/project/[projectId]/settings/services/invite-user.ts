"use server";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

type Args = {
  projectId: string;
  users: { role: string; email: string }[];
};

export async function inviteUser(args: Args) {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const { projectId, users } = args;

  const res = await fetch(
    `${process.env.SERVER_URL}/projects/${projectId}/invite-member`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(users),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));
  return data;
}
