"use server";

import axios from "@/lib/axios";

type DocumentType = {
  name: string;
  value: string;
};
type Args = {
  projectId: string;
  collectionName: string;
  documents: DocumentType[];
};

type Message = {
  message: string;
};

export async function addNewDocuments(args: Args) {
  const { projectId, collectionName, documents } = args;

  try {
    const url = `/projects/${projectId}/add-new-documents`;

    const { data } = await axios.post<Message>(url, {
      collectionName,
      documents,
    });

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
