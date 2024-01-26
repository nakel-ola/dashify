"use server";

import axios from "@/lib/axios";

type Args = {
  projectId: string;
  name: string;
  database: string;
  offset: number;
  limit: number;
  sort: string;
  filter: string;
};

type CollectionsResponse = {
  results: any[];
  totalItems: number;
};

export async function fetchCollection(args: Args) {
  const { projectId, database, limit, name, offset, sort, filter } = args;

  try {
    const url = `/projects/${projectId}/collection?collectionName=${name}&database=${database}&offset=${offset}&limit=${limit}&sort=${sort}&filter=${filter}`;

    const { data } = await axios.get<CollectionsResponse>(url);

    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}
