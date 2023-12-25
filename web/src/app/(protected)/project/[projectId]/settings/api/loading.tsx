import React from "react";
import { TableLoading } from "../../../features/body-loading";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="p-5 lg:p-10 pb-0 lg:pb-0 flex flex-col lg:flex-row justify-between">
        <div className="">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 mt-2 w-[250px]" />
        </div>
        <Skeleton className="w-[200px] h-[40px] mt-10 lg:mt-0" />
      </div>
      <TableLoading />
      <div className="p-5 lg:p-10 pb-0 pt-16 lg:pb-0 flex flex-col lg:flex-row justify-between">
        <div className="">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 mt-2 w-[250px]" />
        </div>
        <Skeleton className="w-[200px] h-[40px] mt-10 lg:mt-0" />
      </div>
      <TableLoading />
    </div>
  );
}
