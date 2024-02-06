"use server";

import axios from "@/lib/axios";

type DocumentType = {
  name: string;
  value: string;
};
type Args = {
  projectId: string;
  collectionName: string;
  fieldNames: string[];
  values: any[][];
};

type Message = {
  message: string;
};

export async function addNewDocuments(args: Args) {
  const { projectId, collectionName, fieldNames, values } = args;

  try {
    const url = `/projects/${projectId}/add-new-documents`;

    const { data } = await axios.post<Message>(url, {
      collectionName,
      fieldNames,
      values,
    });

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
