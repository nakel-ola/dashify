"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";

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
  ok: false;
  message: string;
};

type AxiosReturnType = {
  ok: boolean;
  message: string;
};

export async function updateDocument(args: Args): Promise<AxiosReturnType> {
  const { projectId, collectionName, where, set } = args;

  const url = `/projects/${projectId}/update-document`;

  return axios
    .post<Message>(url, {
      collectionName,
      where,
      set,
    })
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
