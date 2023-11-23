"use client";
import { RippleCard } from "@/components/ripple-card";
import { Add } from "iconsax-react";
import { useModelStore } from "../../store/ModelStore";

export const AddCard = () => {
  const { setIsOpen } = useModelStore();

  return (
    <RippleCard
      onClick={() => setIsOpen(true)}
      className="border-[1.5px] rounded-lg h-[50px] md:h-[180px] flex items-center justify-center bg-white dark:bg-dark border-slate-200 dark:border-neutral-800 text-indigo-600 flex-row md:flex-col cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
    >
      <Add size={30} className="" />

      <p className="pl-2 text-lg mt-0 lg:mt-2">Add project</p>
    </RippleCard>
  );
};
