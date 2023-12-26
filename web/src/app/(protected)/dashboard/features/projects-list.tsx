"use client";

import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import { AddCard } from "./add-card";
import { ProjectCard } from "./project-card";
import { PaginateCard } from "./paginate-card";
import LoadingScreen from "./loading-screen";
import { fetchProjects } from "../services/fetch-projects";

type Props = {
  page: number;
  offset: number;
  limit: number;
};
export const ProjectsList = (props: Props) => {
  const { offset, limit, page } = props;

  const { data, isPending } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects({ offset, limit }),
  });

  const pageCount = Math.ceil((data?.totalItems ?? 0) / limit);

  if (isPending || !data) return <LoadingScreen />;

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
};
