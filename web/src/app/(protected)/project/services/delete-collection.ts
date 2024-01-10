"use server";

import axios from "@/lib/axios";

type Args = {
  projectId: string;
  name: string;
};

type CreateResponse = {
  message: string;
};

export async function deleteCollection(args: Args) {
  const { projectId, name } = args;

  try {
    const url = `/projects/${projectId}/delete-collection/${name}`;

    const { data } = await axios.delete<CreateResponse>(url);

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
