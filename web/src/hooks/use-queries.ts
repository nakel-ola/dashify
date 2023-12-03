"use client";
import { useParams } from "next/navigation";

type GetQueryObj = {
  projectId: string;
  pageName: string;
};

export const useQueries = (): [GetQueryObj, string[]] => {
  const params = useParams();

  const values = (params.index ?? []) as string[];

  return [
    {
      projectId: values[0],
      pageName: values[1],
    },
    values.slice(2),
  ];
};
