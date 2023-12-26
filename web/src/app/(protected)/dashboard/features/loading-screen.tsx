import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingScreen() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 px-5 lg:px-10 gap-8 py-10 -mt-[150px] lg:-mt-[130px] page-max-width">
      {[0, 1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="cursor-pointer border-[1.5px] rounded-lg h-[180px] bg-white dark:bg-dark border-slate-200 dark:border-neutral-800 py-3 px-3 flex flex-col hover:scale-[1.02] active:scale-[0.99]"
        >
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 pl-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex items-center -space-x-5">
              {[0, 1, 2].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white dark:border-dark"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
