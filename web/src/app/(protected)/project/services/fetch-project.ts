import { getAccessToken } from "@/lib/get-access-token";
import axios from "@/lib/axios";

export async function fetchProject(projectId: string): Promise<Projects> {
  const accessToken = await getAccessToken();

  if (!accessToken) throw new Error("Please login");

  const url = `/projects/${projectId}`;

  const { data } = await axios.get<Projects>(url);

  return data;
}
