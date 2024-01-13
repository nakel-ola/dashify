"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset, error }: Props) {
  return (
    <div className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">
          There was a problem
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black dark:text-white">
          {error.message || "Uh oh! Something went wrong."}
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-dark dark:text-gray-light ">
          Pleast try again later or contact support if the problem persists
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={reset}>Try Again</Button>

          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "ghost" })}
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
