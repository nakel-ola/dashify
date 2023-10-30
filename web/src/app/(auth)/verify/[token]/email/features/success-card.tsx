"use client";
import { Button } from "@/components/ui/button";
import checkmarkAnimation from "@/data/animations/checkmark_animation.json";
import Lottie from "lottie-react";

export const SuccessCard = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Lottie
        animationData={checkmarkAnimation}
        loop={false}
        style={{ width: 200, height: 200 }}
      />

      <p className="text-3xl py-2 font-medium">Email Verification Successful</p>

      <Button className="my-2">Go To Dashboard</Button>
    </div>
  );
};
