"use server";

import axios from "@/lib/axios";
import { AxiosThrowError } from "@/utils/axios-throw-error";
import { clean } from "@/utils/clean";

type Reference = {
  fieldName: string;
  collectionName: string;
  onUpdate: "Cascade" | "Restrict" | null;
  onDelete: "Cascade" | "Restrict" | "Set default" | "Set NULL" | null;
};
type AddColumn = {
  name: string;
  dataType: string;
  defaultValue?: string | null;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  isIdentify: boolean;
  isArray: boolean;
  type: "add";
  references?: Reference | null;
};

type DropColumn = {
  name: string;
  type: "drop";
};

type ModifyColumn = {
  operations: (
    | "Rename"
    | "Type"
    | "Add Default"
    | "Remove Default"
    | "Add Not null"
    | "Remove Not null"
    | "FOREIGN"
  )[];
  name: string;
  type: "modify";
  newName?: string;
  dataType?: string;
  defaultValue?: string | null;
  references?: Reference | null;
};
type Args = {
  projectId: string;
  name: string;
  newName?: string;
  columns?: (AddColumn | ModifyColumn | DropColumn)[];
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
    AxiosThrowError(error);
  }
}
