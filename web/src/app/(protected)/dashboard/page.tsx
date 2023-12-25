import { getQueryClient } from "@/lib/tanstack-query";
import React, { Fragment } from "react";
import { AddCard, PaginateCard, ProjectCard } from "./features";
import axios from "@/lib/axios";

type Props = {
  searchParams: {
    page?: string;
  };
};
type ProjectsResponse = {
  results: Projects[];
  totalItems: number;
};

const limit = 10;

export default async function Dashboard(props: Props) {
  const {
    searchParams: { page = "1" },
  } = props;

  const queryClient = getQueryClient();

  const offset = limit * (Number(page) - 1);

  const data = await queryClient.fetchQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      "use server";
      const url = `/projects?offset=${offset}&limit=${limit}`;

      const { data } = await axios.get<ProjectsResponse>(url);

      return data
    },
  });

  const pageCount = Math.ceil((data?.totalItems ?? 0) / limit);

  return (
    <Fragment>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 px-5 lg:px-10 gap-8 py-10 -mt-[150px] lg:-mt-[130px] page-max-width">
        <AddCard />

        {data.results.map((item, index) => (
          <ProjectCard key={index} {...item} />
        ))}
      </div>

      {pageCount > 1 ? (
        <PaginateCard page={Number(page)} pageCount={pageCount} />
      ) : null}
    </Fragment>
  );
}
