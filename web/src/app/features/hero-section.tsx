"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "iconsax-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { HeroImage } from "./hero-image";

export const HeroSection = () => {
  const router = useRouter();
  const { status } = useSession();

  return (
    <div className="">
      <div
        className="h-[520px] md:h-[650px] lg:h-[750px] -mt-[68px] bg-black"
        style={{
          backgroundSize: "75px 75px",
          backgroundImage:
            "linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)",
        }}
      >
        <div
          className="flex items-center justify-center pt-[110px] flex-col page-max-width"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 50% 50%,rgba(93,52,221,0.4),transparent)",
          }}
        >
          <h1 className="text-center text-white text-3xl font-bold tracking-tight sm:text-5xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] max-w-3xl ">
            Empower <span className="text-indigo-600">Your Team</span> with Data{" "}
            <br />
            Management <span className="text-indigo-600">Tools</span>
          </h1>

          <p className="text-gray-light max-w-3xl text-center text-sm sm:text-lg leading-8 mt-5 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms] mx-2">
            Take charge of your database like a pro. Our admin dashboard puts
            the power in your hands, enabling you to manage data efficiently and
            effectively
          </p>

          <div className="flex items-center mt-6 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
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

      <div className="page-max-width flex items-center justify-center -mt-[120px] md:-mt-[250px] lg:-mt-[400px]">
        <HeroImage />
      </div>
    </div>
  );
};
