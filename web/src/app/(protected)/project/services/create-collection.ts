"use server";

import axios from "@/lib/axios";

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

  try {
    const url = `/projects/${projectId}/create-new-collection`;

    const { data } = await axios.post<CreateResponse>(url, { name, columns });

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
