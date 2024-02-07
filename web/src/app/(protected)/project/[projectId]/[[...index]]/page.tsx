"use client";

import { Fragment, useState } from "react";
import {
  AddColumnCard,
  CollectionsCard,
  Header,
  PaginationCard,
  TabsCard,
  ColumnUpdateCard,
  RowUpdateCard,
  AddRowCard,
  AddNewRowCard,
  CSVAddRowsCard,
  JsonRowsCard,
} from "./features";
import { useProjectStore } from "../../store/project-store";
import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../../services/fetch-collection";
import { cn } from "@/lib/utils";
import { SpinnerCircular } from "spinners-react";
import { DeleteAlertCard } from "./features/delete-alert-card";

type Props = {
  params: {
    index: string[];
  };
  searchParams: {
    sort: string;
    filter: string;
  };
};

export default function ProjectCollection(props: Props) {
  const {
    params: { index },
    searchParams: { sort = "", filter = "" },
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState<"100" | "500" | "1000">("100");

  const project = useProjectStore((store) => store.project!);

  const collection = useProjectStore((store) => store.getCollection(index[0]));

  const projectId = project.projectId;

  const name = collection?.name;

  const queryKey = [
    "projects-collection",
    projectId,
    name,
    currentPage,
    sort,
    filter,
  ];

  const { data, refetch, isPending, isFetching, isRefetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const offset = Number(limit) * (currentPage - 1);

      const res = await fetchCollection({
        database: project.database,
        name: name!,
        projectId,
        limit: Number(limit),
        offset,
        sort,
        filter,
      });

      return res;
    },
  });

  const pageCount = Math.ceil((data?.totalItems ?? 0) / Number(limit));

  const isLoading = isRefetching || isPending || isFetching;

  const showSelectAll =
    Number(data?.totalItems ?? 0) > Number(data?.results?.length);

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

  return (
    <Fragment>
      <div className="overflow-y-hidden h-full">
        <TabsCard
          totalItems={Number(data?.totalItems ?? 0)}
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
          showSelectAll={showSelectAll}
        />

        <div
          className={cn(
            "overflow-scroll w-full h-full",
            isLoading || pageCount <= 1
              ? "max-h-[calc(100vh-102px)]"
              : "max-h-[calc(100vh-148px)]"
          )}
        >
          <Header
            pageName={index[0]}
            currentPage={currentPage}
            limit={Number(limit)}
            totalItems={data?.results?.length ?? 0}
            projectId={projectId}
            isMongodb={project.database === "mongodb"}
          />

          {data ? (
            data.results.length > 0 ? (
              <CollectionsCard
                pageName={index[0]}
                items={data.results}
                currentPage={currentPage}
                limit={Number(limit)}
                isMongodb={project.database === "mongodb"}
              />
            ) : (
              <AddNewRowCard />
            )
          ) : null}

          {isPending ? (
            <div className="grid place-items-center h-[calc(100%-50px)]">
              <SpinnerCircular
                size={60}
                thickness={100}
                speed={100}
                color="#4f46e5"
                secondaryColor="rgba(242, 246, 250, 0.20)"
              />
            </div>
          ) : null}
        </div>

        {pageCount > 1 ? (
          <PaginationCard
            totalItems={data?.totalItems!}
            limit={limit}
            page={currentPage}
            pageCount={pageCount}
            onPageChange={onPageChange}
            onLimitChange={setLimit}
          />
        ) : null}
      </div>

      <DeleteAlertCard
        filter={filter}
        pageName={index[0]}
        totalItems={data?.results?.length ?? 0}
        items={data?.results ?? []}
        projectId={projectId}
        queryKey={queryKey}
      />

      <ColumnUpdateCard />
      <AddColumnCard />
      <RowUpdateCard
        isMongodb={project.database === "mongodb"}
        queryKey={queryKey}
      />
      <AddRowCard queryKey={queryKey} />
      <CSVAddRowsCard
        queryKey={queryKey}
        isMongodb={project.database === "mongodb"}
      />
      <JsonRowsCard queryKey={queryKey} />
    </Fragment>
  );
}
