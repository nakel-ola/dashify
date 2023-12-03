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
      projectId: params.projectId as string,
      pageName: values[0],
    },
    values.slice(1),
  ];
};
