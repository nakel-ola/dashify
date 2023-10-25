import { Modal } from "@/components/Modal";
import { RippleCard } from "@/components/RippleCard";
import { Add } from "iconsax-react";
import React, { useState } from "react";
import { CreateCard } from "./CreateCard";

type AddCardProps = {};
export const AddCard = (props: AddCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RippleCard
        onClick={() => setIsOpen(true)}
        className="border-[1.5px] rounded-lg h-[50px] md:h-[180px] flex items-center justify-center bg-white dark:bg-dark border-slate-200 dark:border-neutral-800 text-indigo-600 flex-row md:flex-col cursor-pointer hover:scale-[1.02] active:scale-[0.99]"
      >
        <Add size={30} className="" />

        <p className="pl-2 text-lg mt-0 lg:mt-2">Add project</p>
      </RippleCard>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        className="sm:max-w-[425px] lg:w-[425px]"
      >
        <CreateCard onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
