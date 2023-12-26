"use client";

import { Button } from "@/components/ui/button";
import { Verify } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SuccessCard = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Verify className="text-indigo-600 h-14 w-14" fill="" />

      <p className=" text-black dark:text-white text-center text-[37.279px]  font-bold leading-[128%]">
        Email verified
      </p>

      <p className="text-3xl pt-2 text-black dark:text-white text-center text-[15.977px]  font-[250] leading-[140%]">
        Your email has been verified successfully!
      </p>

      <Button className="my-2 mt-16 w-[350px]" onClick={() => router.push("/")}>
        Finish
      </Button>

      <Link
        href={`/dashboard`}
        className="mt-5 text-indigo-600 text-center text-[15.977px] not-italic font-[250] leading-[128%] underline"
      >
        Go to dashboard
      </Link>
    </div>
  );
};
