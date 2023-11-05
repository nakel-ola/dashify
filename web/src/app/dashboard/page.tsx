import React, { Fragment } from "react";
import { AddCard, PaginateCard, ProjectCard } from "./features";
import { fetchProjects } from "./services/fetch-projects";

type Props = {
  searchParams: {
    page?: string;
  };
};
const limit = 10;

export default async function Dashboard(props: Props) {
  const {
    searchParams: { page = "1" },
  } = props;

  const offset = limit * (Number(page) - 1);
  const data = await fetchProjects(offset, limit);

  const pageCount = Math.ceil((data?.totalItems ?? 0) / limit);

  return (
    <Fragment>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 px-5 lg:px-10 gap-8 py-10 -mt-[180px] lg:-mt-[150px] page-max-width">
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
