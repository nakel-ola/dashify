"use server";

import axios from "@/lib/axios";

type Args = {
  projectId: string;
  collectionName: string;
  where?: { name: string; value: string }[];
  deleteAll?: boolean | string;
};

type DeleteResponse = {
  message: string;
};

export async function deleteRow(args: Args) {
  const { projectId, collectionName, where, deleteAll } = args;
  try {
    const url = `/projects/${projectId}/delete-documents`;

    const { data } = await axios.delete<DeleteResponse>(url, {
      data: { collectionName, where, deleteAll },
    });

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
