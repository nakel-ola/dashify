"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";
import { AxiosThrowError } from "@/utils/axios-throw-error";

type Args = {
  projectId: string;
};

type DeleteResponse = {
  message: string;
};

export async function deleteProject(args: Args) {
  const { projectId } = args;

  const url = `/projects/${projectId}`;

  return axios
    .delete<DeleteResponse>(url)
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
