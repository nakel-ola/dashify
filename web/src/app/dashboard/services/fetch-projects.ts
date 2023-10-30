import { formatErrorMessage } from "@/lib/format-error-message";
import { getAccessToken } from "@/lib/get-access-token";

type ProjectsResponse = {
  results: Projects[];
  totalItems: number;
};
export async function fetchProjects(
  offset: number,
  limit: number = 10
): Promise<ProjectsResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const res = await fetch(
    `${process.env.SERVER_URL}/projects?offset=${offset}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "x-access-token": `Bearer ${accessToken}`,
      },
      next: { tags: ["projects"] },
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(formatErrorMessage(data.message));

  return data;
}
