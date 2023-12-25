import { Skeleton } from "@/components/ui/skeleton";
import { BodyLoading } from "./body-loading";

export const PageLoader = () => {
  return (
    <div className="page-max-width h-screen overflow-hidden">
      {/* navbar */}

      <div className="flex items-center justify-between px-5 border-b-[1.5px] border-slate-100 dark:border-neutral-800 py-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-4 w-[150px]" />
        </div>

        <div className="flex items-center space-x-5">
          <Skeleton className="h-10 w-10 rounded-full hidden lg:block" />

          <div className="flex items-center space-x-2 cursor-pointer">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-[150px] hidden lg:block" />
          </div>
        </div>
      </div>

      <div className=" grid grid-cols-10 h-[calc(100vh-57.4px)]">
        {/* sidebar */}

        <div className="col-span-2 border-r-[1.5px] border-slate-100 dark:border-neutral-800 h-full overflow-y-scroll hidden lg:flex flex-col">
          <div className="pt-5">
            {Array.from({ length: 5 })
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-center m-2 mb-3 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer mt-auto"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-[150px] ml-2" />
                </div>
              ))}
          </div>

          <div className="flex items-center m-2 mb-3 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer mt-auto">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-[150px] ml-2" />
          </div>
        </div>

        <BodyLoading />
      </div>
    </div>
  );
};
