"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";
import { AxiosThrowError } from "@/utils/axios-throw-error";

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
  const url = `/projects/${projectId}/delete-documents`;

  return axios
    .delete<DeleteResponse>(url, {
      data: { collectionName, where, deleteAll },
    })
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
