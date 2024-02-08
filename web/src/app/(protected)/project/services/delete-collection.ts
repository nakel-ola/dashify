"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";
import { AxiosThrowError } from "@/utils/axios-throw-error";

type Args = {
  projectId: string;
  name: string;
};

type DeleteResponse = {
  message: string;
};

export async function deleteCollection(args: Args) {
  const { projectId, name } = args;

  const url = `/projects/${projectId}/delete-collection/${name}`;

  return axios
    .delete<DeleteResponse>(url)
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
