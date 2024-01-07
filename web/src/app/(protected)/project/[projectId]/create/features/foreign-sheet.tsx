"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForeignStore } from "../../../store/foreign-store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Maximize4 } from "iconsax-react";
import { ExternalLink } from "lucide-react";
import { useProjectStore } from "../../../store/project-store";

type Props = {};
export const ForeignSheet = (props: Props) => {
  const { column, setColumn } = useForeignStore();
  const [collection, setCollection] = useState<Collection | null>(null);
  const { project, getCollection } = useProjectStore();

  const collections = project?.collections ?? [];

  const updateCollection = (name: string) => {
    setCollection(getCollection(name) ?? null);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={!!column} onOpenChange={() => setColumn(null)}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            Edit foreign key relation
            <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 ml-2">
              {column?.name}
            </span>
          </SheetTitle>
        </SheetHeader>

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-[350px] space-y-2 mt-10 px-4 py-2.5 rounded-md bg-slate-100 dark:bg-neutral-800"
        >
          <div className="flex items-center justify-between space-x-4 ">
            <h4 className="text-base font-semibold">What are foreign keys?</h4>
            <CollapsibleTrigger>
              <button className="w-6 h-full flex items-center justify-center">
                <Maximize4 className="h-4 w-4" />
              </button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="pt-2.5">
            <p className="text-sm">
              Foreign keys help maintain referential integrity of your data by
              ensuring that no one can insert rows into the table that do not
              have a matching entry to another table.
            </p>

            <a
              target="_blank"
              rel="noreferrer"
              className="border rounded-md flex items-center justify-center mt-5 py-0.5"
              type="button"
              href="https://www.postgresql.org/docs/current/tutorial-fk.html"
            >
              <ExternalLink size={15} />
              <span className="truncate text-sm pl-2">
                Postgres Foreign Key Documentation
              </span>
            </a>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-10">
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
          <div className="mt-10">
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
      </SheetContent>
    </Sheet>
  );
};
