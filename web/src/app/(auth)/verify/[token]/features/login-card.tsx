"use client";
import { Button } from "@/components/ui/button";
import { Login } from "iconsax-react";
import { useRouter } from "next/navigation";

export const LoginCard = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Login className="text-indigo-600 w-24 h-24" />

      <p className="text-black dark:text-white text-center text-[37.279px]  font-bold leading-[128%]">
        Login please
      </p>

      <p className="text-3xl pt-2 text-black dark:text-white text-center text-[15.977px]  font-[250] leading-[140%]">
        You need to login to verify your account
      </p>

      <Button
        className="my-2 mt-14 w-[350px]"
        onClick={() => router.push("/auth/login")}
      >
        Login now
      </Button>
    </div>
  );
};
