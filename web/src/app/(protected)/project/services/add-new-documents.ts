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
  fieldNames: string[];
  values: any[][];
};

type Message = {
  message: string;
};

export async function addNewDocuments(args: Args) {
  const { projectId, collectionName, fieldNames, values } = args;
  const url = `/projects/${projectId}/add-new-documents`;

  return axios
    .post<Message>(url, {
      collectionName,
      fieldNames,
      values,
    })
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
