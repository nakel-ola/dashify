"use client";

import { Button } from "@/components/ui/button";
import { useProjectStore } from "../../../store/project-store";
import { useCollectionModalStore } from "../../../store/collection-modal-store";

export const CreateCard = () => {
  const project = useProjectStore((store) => store.project);
  const { setIsOpen: setIsCollectionOpen } = useCollectionModalStore();

  return (
    <div className="grid place-items-center h-[calc(100vh-60px)]">
      <div className="cursor-pointer border-[1.5px] rounded-lg h-[180px] w-[350px] bg-white dark:bg-dark border-slate-200 dark:border-neutral-800 p-4 flex flex-col transition-transform duration-300 ">
        <p className="text-2xl font-medium text-black dark:text-white">
          {project?.name}
        </p>

        <p className="py-4 text-sm text-gray-dark dark:text-gray-light">
          Select a {project?.database === "mongodb" ? "collection" : "table"}{" "}
          from the navigation panel on the left to view its data, or create a
          new one.
        </p>

        <Button
          className="w-fit mt-auto rounded-lg"
          onClick={() => setIsCollectionOpen(true)}
        >
          Create a new{" "}
          {project?.database === "mongodb" ? "collection" : "table"}
        </Button>
      </div>
    </div>
  );
};
