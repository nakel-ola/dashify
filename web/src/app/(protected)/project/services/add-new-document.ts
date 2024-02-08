"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";
import { AxiosThrowError } from "@/utils/axios-throw-error";

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

export async function addNewDocument(args: Args) {
  const { projectId, collectionName, documents } = args;

  const url = `/projects/${projectId}/add-new-document`;

  return axios
    .post<Message>(url, {
      collectionName,
      documents,
    })
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
