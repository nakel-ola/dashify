"use server";

import axios from "@/lib/axios";

type Where = {
  name: string;
  value: any;
};
type Args = {
  projectId: string;
  collectionName: string;
  where: Where;
  set: Where[];
};

type Message = {
  message: string;
};

export async function updateDocument(args: Args) {
  const { projectId, collectionName, where, set } = args;

  try {
    const url = `/projects/${projectId}/update-document`;

    const { data } = await axios.post<Message>(url, {
      collectionName,
      where,
      set,
    });

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
