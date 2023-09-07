import { useRouter } from "next/router";

type GetQueryObj = {
  projectId: string;
  pageName: string;
};

export const useQueries = (): [GetQueryObj, string[]] => {
  const router = useRouter();

  const values = (router.query.index ?? []) as string[];

  return [
    {
      projectId: values[0],
      pageName: values[1],
    },
    values.slice(2),
  ];
};
