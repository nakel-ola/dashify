"use server";

import axios from "@/lib/axios";

type Args = {
  projectId: string;
};

export async function refetchCollections(args: Args) {
  const { projectId } = args;

  try {
    const url = `/projects/${projectId}/refetch-collections`;

    const { data } = await axios.get<Collection[]>(url);

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
