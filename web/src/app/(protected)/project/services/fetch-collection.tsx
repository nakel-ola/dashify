"use server";

import axios from "@/lib/axios";

type Args = {
  projectId: string;
  name: string;
  database: string;
  offset: number;
  limit: number;
};

type CollectionsResponse = {
  results: any[];
  totalItems: number;
};

export async function fetchCollection(args: Args) {
  const { projectId, database, limit, name, offset } = args;

  try {
    const url = `/projects/collection/${projectId}?collectionName=${name}&database=${database}&offset=${offset}&limit=${limit}`;

    const { data } = await axios.get<CollectionsResponse>(url);

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
