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
} from "./features";
import { useProjectStore } from "../../store/project-store";
import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../../services/fetch-collection";
import { cn } from "@/lib/utils";
import { SpinnerCircular } from "spinners-react";
import { generateNumbers } from "../../utils/generate-numbers";

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

  const [selected, setSelected] = useState<number[]>([]);

  const project = useProjectStore((store) => store.project!);

  const collection = useProjectStore((store) => store.getCollection(index[0]));

  const projectId = project.projectId;

  const name = collection?.name;

  const { data, refetch, isPending, isFetching, isRefetching } = useQuery({
    queryKey: [
      "projects-collection",
      projectId,
      name,
      currentPage,
      sort,
      filter,
    ],
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

  const getValue = (value: number) => {
    const startNumber = (currentPage - 1) * Number(limit);

    return startNumber + value;
  };

  const updateSelected = (value: number) => {
    const currentValue = getValue(value);

    const arr = [...selected];

    const inx = arr.indexOf(currentValue);

    if (inx === -1) arr.push(currentValue);
    else arr.splice(inx, 1);

    setSelected(arr);
  };

  const isSelected = (value: number) => {
    const currentValue = getValue(value);

    return selected.indexOf(currentValue) !== -1;
  };

  const onSelectAll = () => {
    if (!data) return;

    if (data.results.length === selected.length) {
      setSelected([]);
    } else {
      const startNumber = getValue(0);
      const endNumber = getValue(data.results.length) - 1;

      const numbers = generateNumbers(startNumber, endNumber);

      setSelected(numbers);
    }
  };

  return (
    <Fragment>
      <div className="overflow-y-hidden h-full">
        <TabsCard
          isAnySelected={selected.length > 0}
          totalSelected={selected.length}
          totalItems={data?.totalItems ?? 0}
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
          removeSelected={() => setSelected([])}
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
            onSelectAll={onSelectAll}
            isAllSelected={
              (data?.results ?? []).length > 0
                ? data?.results.length === selected.length
                : false
            }
            projectId={projectId}
            isMongodb={project.database === "mongodb"}
          />

          {data ? (
            <CollectionsCard
              pageName={index[0]}
              items={data.results}
              isSelected={isSelected}
              updateSelected={updateSelected}
            />
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

      <ColumnUpdateCard />
      <AddColumnCard />
      <RowUpdateCard />
      <AddRowCard />
    </Fragment>
  );
}
