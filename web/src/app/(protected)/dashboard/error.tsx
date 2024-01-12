"use client";
import { Button } from "@/components/ui/button";
import { CloseCircle } from "iconsax-react";

type Props = {
  reset: () => void;
};

export default function Error({ reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <CloseCircle className="text-red-500 w-24 h-24" />

      <p className="text-black dark:text-white text-center text-[37.279px]  font-bold leading-[128%] my-5">
        Uh oh! Something went wrong.
      </p>

      <Button onClick={() => reset()} className="mt-2">
        Refetch
      </Button>
    </div>
  );
}
