"use server";

import axios from "@/lib/axios";
import { clean } from "@/utils/clean";

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
  newName?: string;
  columns?: Column[];
};

type CreateResponse = {
  message: string;
};

export async function editCollection(args: Args) {
  const { projectId, name, newName, columns } = args;

  try {
    const url = `/projects/${projectId}/edit-collection`;

    const { data } = await axios.put<CreateResponse>(
      url,
      clean({
        collectionName: name,
        newCollectionName: newName,
        columns,
      })
    );

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
