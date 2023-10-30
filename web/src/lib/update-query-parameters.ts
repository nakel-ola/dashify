import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface QueryParams {
  [key: string]: string | string[];
}

export const updateQueryParameters = (
  router: AppRouterInstance,
  paramsToAdd: QueryParams = {},
  paramsToRemove: string[] = []
): string => {
  // Get the current query object from the router
  const currentQuery = { ...router.query };

  // Add query parameters
  for (const [key, value] of Object.entries(paramsToAdd)) {
    currentQuery[key] = value;
  }

  // Remove query parameters
  for (const param of paramsToRemove) {
    delete currentQuery[param];
  }

  // Construct the updated query string
  const updatedQueryString = new URLSearchParams(
    currentQuery as any
  ).toString();

  // Combine the pathname and the updated query string to get the updated URL
  return `${router.pathname}${
    updatedQueryString ? "?" + updatedQueryString : ""
  }`;
};
