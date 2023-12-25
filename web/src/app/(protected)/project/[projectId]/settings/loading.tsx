import { Skeleton } from "@/components/ui/skeleton";
import { PropsWithChildren } from "react";

export default function Loading() {
  return (
    <div className="px-5 lg:px-10 py-10">
      <Wrapper>
        <div className="flex gap-5">
          <Skeleton className="h-[100px] w-[100px] rounded-full" />

          <div className="">
            <Skeleton className="w-[150px] h-[40px] mt-10 lg:mt-0" />
            <Skeleton className="h-4 mt-2 w-[250px]" />
          </div>
        </div>

        <Input />
        <Input />

        <div className="flex">
          <Skeleton className="w-[150px] h-[40px] mt-10 lg:mt-0 rounded-full ml-auto" />
        </div>
      </Wrapper>

      <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-14" />

      <Wrapper>
        <div className="border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg h-[100px] mt-2"></div>
        <Input />
        <Input />
        <Input />
        <Input />
        <Input />
      </Wrapper>

      <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-14" />

      <Wrapper>
        <div className="border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg h-[100px] mt-2"></div>

        <div className="flex">
          <Skeleton className="w-[150px] h-[40px] mt-10 lg:mt-0 rounded-full ml-auto" />
        </div>
      </Wrapper>
    </div>
  );
}

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="lg:w-[50%]">
        <Skeleton className="h-6 w-[250px]" />
        <Skeleton className="h-4 mt-2 w-[250px]" />
      </div>

      <div className="space-y-6 w-full">{children}</div>
    </div>
  );
};

const Input = () => {
  return (
    <div className="">
      <Skeleton className="h-4 w-[150px]" />

      <div className="border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg h-[45px] mt-2"></div>
    </div>
  );
};
