"use client";

import { useState } from "react";
import { CollectionsCard, Header, PaginationCard, TabsCard } from "./features";
import { useProjectStore } from "../../store/project-store";
import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../../services/fetch-collection";
import { cn } from "@/lib/utils";
import { SpinnerCircular } from "spinners-react";

type Props = {
  params: {
    index: string[];
  };
  searchParams: {
    page?: string;
  };
};

export default function Project(props: Props) {
  const {
    params: { index },
    searchParams: { page = "1" },
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(2);

  const project = useProjectStore((store) => store.project!);

  const collection = project.collections.find((c) => c.name === index[0]);

  const projectId = project.projectId;

  const name = collection?.name;

  const { data, refetch, isPending, isFetching, isRefetching } = useQuery({
    queryKey: ["projects-collection", projectId, name, currentPage],
    queryFn: async () => {
      const offset = limit * (currentPage - 1);

      const res = await fetchCollection({
        database: project.database,
        name: name!,
        projectId,
        limit,
        offset,
      });

      return res;
    },
  });

  const pageCount = Math.ceil((data?.totalItems ?? 0) / limit);

  const onPageChange = (value: "next" | "previous" | number) => {
    if (value === "next" && pageCount > currentPage) {
      setCurrentPage(currentPage + 1);
    }
    if (value === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    if (typeof value === "number" && pageCount > value) {
      setCurrentPage(value);
    }
  };

  const isLoading = isRefetching || isPending || isFetching;

  return (
    <div className="overflow-y-hidden h-full">
      <TabsCard onRefresh={() => refetch()} isRefreshing={isLoading} />

      <div
        className={cn(
          "overflow-x-scroll overflow-y-hidden w-full ",
          isLoading || pageCount <= 1
            ? "h-[calc(100vh-102px)]"
            : "h-[calc(100vh-148px)]"
        )}
      >
        <Header pageName={index[0]} />

        {data ? (
          <CollectionsCard pageName={index[0]} items={data.results} />
        ) : null}

        {isPending ? (
          <div className="grid place-items-center h-full">
            <SpinnerCircular
              size={60}
              thickness={100}
              speed={100}
              color="#36ad47"
              secondaryColor="rgba(242, 246, 250, 0.20)"
            />
          </div>
        ) : null}
      </div>

      {!isLoading && pageCount > 1 ? (
        <PaginationCard
          totalItems={data?.totalItems!}
          limit={limit}
          page={currentPage}
          pageCount={pageCount}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}
