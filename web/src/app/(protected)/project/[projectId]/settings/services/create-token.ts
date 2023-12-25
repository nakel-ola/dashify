"use server";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

type Args = {
  projectId: string;
  name: string;
  permission: "editor" | "viewer";
};

export async function createToken(args: Args) {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const { projectId, permission, name } = args;

  const res = await fetch(
    `${process.env.SERVER_URL}/projects/${projectId}/add-token`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ permission, name }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));
  return data as { token: string; message: string; };
}
