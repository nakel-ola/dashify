"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";

type Args = {
  projectId: string;
};

type AxiosReturnType = {
  ok: boolean;
  message?: string;
  collections?: Collection[];
};

export async function refetchCollections(args: Args): Promise<AxiosReturnType> {
  const { projectId } = args;
  const url = `/projects/${projectId}/refetch-collections`;

  return axios
    .get<Collection[]>(url)
    .then((result) => {
      return { ok: true, collections: result.data };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
