"use server";

import axios from "@/lib/axios";

type ProjectsResponse = {
  results: Projects[];
  totalItems: number;
};

type Args = {
  offset: number;
  limit: number;
};
export async function fetchProjects(args: Args) {
  try {
    const { offset, limit } = args;
    const url = `/projects?offset=${offset}&limit=${limit}`;

    const { data } = await axios.get<ProjectsResponse>(url);

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
