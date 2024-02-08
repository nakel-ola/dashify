"use server";

import axios from "@/lib/axios";
import { axiosFormatError } from "@/utils/axios-format-error";
import { AxiosThrowError } from "@/utils/axios-throw-error";

type Column = {
  name: string;
  dataType: string;
  defaultValue?: string | null;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  isIdentify: boolean;
  isArray: boolean;
  references?: {
    collectionName?: string;
    fieldName?: string;
    onUpdate?: "Cascade" | "Restrict" | null;
    onDelete?: "Cascade" | "Restrict" | "Set default" | "Set NULL" | null;
  } | null;
};
type Args = {
  projectId: string;
  name: string;
  columns: Column[];
};

type CreateResponse = {
  message: string;
};

export async function createCollection(args: Args) {
  const { projectId, name, columns } = args;

  const url = `/projects/${projectId}/create-new-collection`;

  return axios
    .post<CreateResponse>(url, {
      collectionName: name,
      columns,
    })
    .then((result) => {
      return { ok: true, message: result.data.message };
    })
    .catch((err) => {
      return { ok: false, message: axiosFormatError(err) };
    });
}
