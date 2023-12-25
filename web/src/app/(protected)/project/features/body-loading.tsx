import { Skeleton } from "@/components/ui/skeleton";

export const BodyLoading = () => {
  return (
    <div className="col-span-10 lg:col-span-8 h-full overflow-y-scroll">
      <Skeleton className="h-[200px] rounded-none bg-slate-100 dark:bg-neutral-800" />

      <BodyBottomLoading />
    </div>
  );
};

export const BodyBottomLoading = () => {
  return (
    <div className="p-5 lg:p-10">
      {/* table */}
      <div className="hidden lg:block h-[300px] w-full border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg">
        {/* table header */}
        <div className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 h-[50px] flex justify-between items-center px-5 gap-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>

        {/* table body */}
        <div className="divide-y divide-slate-100 dark:divide-neutral-800 ">
          {Array.from({ length: 5 })
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-[50px] flex justify-between items-center px-5 gap-2"
              >
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
              </div>
            ))}
        </div>
      </div>

      <div className="lg:hidden space-y-5 divide-y divide-slate-100 dark:divide-neutral-800">
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex items-center  gap-5 pt-5">
              <Skeleton className="h-4 w-full " />
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            </div>
          ))}
      </div>
    </div>
  );
};


export const TableLoading = () => {
  return (
    <div className="p-5 lg:p-10">
      {/* table */}
      <div className="hidden lg:block h-[300px] w-full border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg">
        {/* table header */}
        <div className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 h-[50px] flex justify-between items-center px-5 gap-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>

        {/* table body */}
        <div className="divide-y divide-slate-100 dark:divide-neutral-800 ">
          {Array.from({ length: 5 })
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-[50px] flex justify-between items-center px-5 gap-2"
              >
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
                <Skeleton className="h-3 w-[150px] bg-slate-100 dark:bg-neutral-800" />
              </div>
            ))}
        </div>
      </div>

      <div className="lg:hidden space-y-5 divide-y divide-slate-100 dark:divide-neutral-800">
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex items-center  gap-5 pt-5">
              <Skeleton className="h-4 w-full " />
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            </div>
          ))}
      </div>
    </div>
  );
};
