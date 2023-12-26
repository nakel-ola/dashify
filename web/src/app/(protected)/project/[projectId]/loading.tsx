import { Fragment } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BodyBottomLoading } from "../features/body-loading";

export default function Loading() {
  return (
    <Fragment>
      <Skeleton className="h-[200px] rounded-none bg-slate-100 dark:bg-neutral-800" />

      <BodyBottomLoading />
    </Fragment>
  );
}
