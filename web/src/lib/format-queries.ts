type GetQueryObj = {
  projectId: string;
  pageName: string;
};

export function formatQueries(values: string[]): [GetQueryObj, string[]] {
  return [
    {
      projectId: values[0],
      pageName: values[1],
    },
    values.slice(2),
  ];
}
