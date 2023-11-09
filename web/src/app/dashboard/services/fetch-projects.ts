import axios from "@/lib/axios";
import { getAccessToken } from "@/lib/get-access-token";

export type ProjectsResponse = {
  results: Projects[];
  totalItems: number;
};
export async function fetchProjects(
  offset: number,
  limit: number = 10
): Promise<ProjectsResponse> {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const url = `/projects?offset=${offset}&limit=${limit}`;

  const { data } = await axios.get<ProjectsResponse>(url);

  return data;
}
