import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

export async function fetchProject(projectId: string): Promise<Projects> {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const res = await fetch(`${process.env.SERVER_URL}/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "x-access-token": `Bearer ${accessToken}`,
    },
    next: { tags: [projectId] },
  });

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
