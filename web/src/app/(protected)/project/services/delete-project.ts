"use server";

import axios from "@/lib/axios";

type Args = {
  projectId: string;
};

type DeleteResponse = {
  message: string;
};

export async function deleteProject(args: Args) {
  const { projectId } = args;

  try {
    const url = `/projects/${projectId}`;

    const { data } = await axios.delete<DeleteResponse>(url);

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
