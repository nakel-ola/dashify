"use server";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

type Args = {
  projectId: string;
  origin: string;
  permission: "allow" | "block";
};

export async function addOriginToProject(args: Args) {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const { projectId, permission, origin } = args;

  const res = await fetch(
    `${process.env.SERVER_URL}/projects/${projectId}/add-cors-origin`,
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "x-access-token": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ permission, origin }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));
  return data;
}
