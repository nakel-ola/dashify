"use server";
import { getAccessToken } from "@/lib/get-access-token";
import axios from "@/lib/axios";
import { AxiosThrowError } from "@/utils/axios-throw-error";

export async function fetchProjectByInvitation(projectId: string) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) throw new Error("Please login");

    const url = `/projects/${projectId}/by-invitation`;

    const { data } = await axios.get<Projects>(url);

    return data;
  } catch (error: any) {
    AxiosThrowError(error);
  }
}
