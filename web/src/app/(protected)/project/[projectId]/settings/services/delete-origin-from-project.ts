"use server";
import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

type Args = {
  projectId: string;
  corsId: string;
};

export async function deleteOriginFromProject(args: Args) {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const { projectId, corsId } = args;

  const res = await fetch(
    `${process.env.SERVER_URL}/projects/${projectId}/remove-cors-origin/${corsId}`,
    {
      method: "DELETE",
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
