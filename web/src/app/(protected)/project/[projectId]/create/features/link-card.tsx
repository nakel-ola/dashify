"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { useProjectStore } from "../../../store/project-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link21 } from "iconsax-react";
import { Button } from "@/components/ui/button";

export const LinkCard = () => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const { project, getCollection } = useProjectStore();

  const collections = project?.collections ?? [];

  const updateCollection = (name: string) => {
    setCollection(getCollection(name) ?? null);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <div className="bg-slate-100 dark:bg-neutral-800 rounded shrink-0 ml-2 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 h-9 w-9">
          <Link21 size={20} />
        </div>
      </PopoverTrigger>

      <PopoverContent className="!p-0 !w-80" side="top" sideOffset={10}>
        <div className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 px-4 py-2">
          <p className="">Edit foreign key relation</p>
        </div>

        <div className="px-4 py-2 space-y-5">
          <div className="">
            <label
              htmlFor="type"
              className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5"
            >
              Select a table to reference to
            </label>
            <Select value={collection?.name} onValueChange={updateCollection}>
              <SelectTrigger className="w-full !h-[38px]">
                <SelectValue defaultValue="" placeholder="---" className="" />
              </SelectTrigger>

              <SelectContent className="max-h-52 overflow-y-scroll">
                {collections.map(({ name }, index) => (
                  <SelectItem key={index} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {collection ? (
            <div className="">
              <label
                htmlFor="type"
                className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5"
              >
                Select a column from to reference to
              </label>
              <Select>
                <SelectTrigger className="w-full !h-[38px]">
                  <SelectValue defaultValue="" placeholder="---" className="" />
                </SelectTrigger>

                <SelectContent className="max-h-52 overflow-y-scroll">
                  {(collection?.fields ?? []).map(({ name }, index) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        <div className="px-4 py-2 gap-2 flex border-t-[1.5px] border-slate-100 dark:border-neutral-800">
          <Button type="submit" className="ml-auto">
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
