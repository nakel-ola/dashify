import { Button } from "@/components/ui/button";
import { ArrowRight } from "iconsax-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const CTASection = () => {
  const router = useRouter();
  const { status } = useSession();

  return (
    <div
      className="flex items-center justify-center bg-black"
      style={{
        backgroundSize: "75px 75px",
        backgroundImage:
          " linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
      }}
    >
      <div
        className="mx-auto max-w-xl px-5 lg:px-10 py-20 pb-16  text-center lg:mx-0 lg:flex-auto lg:text-left  "
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 80% at 50% 50%,rgba(93,52,221,0.4),transparent)",
        }}
      >
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
          Boost your productivity.
          <br />
          Start using our app today.
        </h2>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {status !== "authenticated" ? (
            <Button
              onClick={() => router.push("/auth/register")}
              className="p-6 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/dashboard")}
              className="p-6 text-lg"
            >
              Dashboard
              <ArrowRight className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
