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
import { Maximize4, Warning2 } from "iconsax-react";
import { ExternalLink, HelpCircle } from "lucide-react";
import { useProjectStore } from "../../../store/project-store";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ColumnType } from "../schema";

type Props = {
  updateColumn: <T extends keyof ColumnType>(
    index: number,
    key: T,
    value: ColumnType[T]
  ) => void;
};
export const ForeignSheet = (props: Props) => {
  const { updateColumn } = props;
  const { column, setColumn } = useForeignStore();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [field, setField] = useState<Fields | null>(null);
  const [updated, setUpdated] = useState<"Cascade" | "Restrict" | null>(null);
  const [deleted, setDeleted] = useState<
    "Cascade" | "Restrict" | "Set default" | "Set NULL" | null
  >(null);
  const { project, getCollection, getField } = useProjectStore();

  const collections = project?.collections ?? [];

  const updateCollection = (name: string) => {
    setCollection(getCollection(name) ?? null);
  };

  const updateField = (name: string) => {
    if (!collection) return;
    setField(getField(collection.name, name) ?? null);
  };

  const disabled = () => {
    if (!collection || !field || field.udtName !== column?.dataType || !column)
      return true;

    return false;
  };

  const handleClose = () => {
    setColumn(null);
    setCollection(null);
    setField(null);
    setUpdated(null);
    setDeleted(null);
  };

  const handleSave = () => {
    if (!collection || !field || field.udtName !== column?.dataType || !column)
      return;

    updateColumn(column.index, "references", {
      collectionName: collection.name,
      fieldName: field.name,
      onDelete: deleted,
      onUpdate: updated,
    });
    handleClose();
  };

  return (
    <Sheet open={!!column} onOpenChange={() => handleClose()}>
      <SheetContent className="sm:!w-[700px] sm:max-w-md !p-0">
        <SheetHeader className="p-6 border-b-[1.5px] border-slate-100 dark:border-neutral-800">
          <SheetTitle>
            Edit foreign key relation
            <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 ml-2">
              {column?.name}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="h-[calc(100%-130px)] overflow-y-scroll p-6">
          <Collapsible className="w-full space-y-2 px-4 py-2.5 rounded-md bg-slate-100/60 dark:bg-neutral-800/60">
            <div className="flex items-center justify-between space-x-4 ">
              <div className="flex items-center space-x-2">
                <HelpCircle size={20} />
                <h4 className="text-base font-semibold">
                  What are foreign keys?
                </h4>
              </div>
              <CollapsibleTrigger>
                <div className="w-6 h-full flex items-center justify-center cursor-pointer">
                  <Maximize4 className="h-4 w-4" />
                </div>
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
                className="border dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 rounded-md flex items-center justify-center mt-5 py-0.5"
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

          <div className="mt-6">
            <label
              htmlFor="type"
              className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5 pb-1"
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
            <>
              <div className="mt-6">
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5 pb-1"
                >
                  Select a column from to reference to
                </label>
                <Select value={field?.name} onValueChange={updateField}>
                  <SelectTrigger className="w-full !h-[38px]">
                    <SelectValue
                      defaultValue=""
                      placeholder="---"
                      className=""
                    />
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

              {field ? (
                <>
                  {field.udtName !== column?.dataType ? (
                    <div className="border-[1.5px] border-amber-700 rounded-lg bg-amber-700/10 dark:bg-amber-600/10 p-5 flex gap-5 my-4 mt-10">
                      <Warning2 className="text-amber-900 shrink-0 mt-1" />

                      <div className="">
                        <p className="text-amber-800 dark:text-amber-700">
                          Warning: Column types do not match
                        </p>
                        <p className="text-amber-600 dark:text-gray-light text-sm">
                          The referenced column
                          <span className="bg-slate-100 dark:bg-slate-100/10 rounded-md px-1  mx-1">
                            {column?.name}
                          </span>
                          is of type
                          <span className="bg-slate-100 dark:bg-slate-100/10 rounded-md px-1  mx-1">
                            {column?.dataType}
                          </span>
                          while the selected foreign column
                          <span className="bg-slate-100 dark:bg-slate-100/10 rounded-md px-1  mx-1">
                            {collection.name}.{field.name}
                          </span>
                          has
                          <span className="bg-slate-100 dark:bg-slate-100/10 rounded-md px-1  mx-1">
                            {field.udtName}
                          </span>
                          type. These two columns can&apos;t be referenced until
                          they are of the same type.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              <Separator className="my-8" />

              <Collapsible className="w-full space-y-2 px-4 py-2.5 rounded-md bg-slate-100/60 dark:bg-neutral-800/60">
                <div className="flex items-center justify-between space-x-4 ">
                  <div className="flex items-center space-x-2">
                    <HelpCircle size={20} />
                    <h4 className="text-base font-semibold">
                      Which action is most appropriate?
                    </h4>
                  </div>
                  <CollapsibleTrigger>
                    <div className="w-6 h-full flex items-center justify-center cursor-pointer">
                      <Maximize4 className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="pt-2.5">
                  <p className="text-sm">
                    The choice of the action depends on what kinds of objects
                    the related tables represent:
                  </p>

                  <ul className="mt-2 list-disc pl-4 space-y-1">
                    <li className="text-sm">
                      <span className="text-xs bg-slate-200 dark:bg-neutral-700 rounded-md px-1 py-0.5 mr-1">
                        Cascade
                      </span>
                      : if the referencing table represents something that is a
                      component of what is represented by the referenced table
                      and cannot exist independently
                    </li>
                    <li className="text-sm">
                      <span className="text-xs bg-slate-200 dark:bg-neutral-700 rounded-md px-1 py-0.5 mr-1">
                        Restrict
                      </span>{" "}
                      or{" "}
                      <span className="text-xs bg-slate-200 dark:bg-neutral-700 rounded-md px-1 py-0.5 mr-1">
                        No action
                      </span>
                      : if the two tables represent independent objects
                    </li>
                    <li className="text-sm">
                      <span className="text-xs bg-slate-200 dark:bg-neutral-700 rounded-md px-1 py-0.5 mr-1">
                        Set NULL
                      </span>{" "}
                      or{" "}
                      <span className="text-xs bg-slate-200 dark:bg-neutral-700 rounded-md px-1 py-0.5 mr-1">
                        Set default
                      </span>
                      : if a foreign-key relationship represents optional
                      information
                    </li>
                  </ul>

                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="border dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 rounded-md flex items-center justify-center mt-5 py-0.5"
                    type="button"
                    href="https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK"
                  >
                    <ExternalLink size={15} />
                    <span className="truncate text-sm pl-2">
                      More information
                    </span>
                  </a>
                </CollapsibleContent>
              </Collapsible>

              <div className="mt-6">
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5 pb-1"
                >
                  Action if referenced row is updated
                </label>
                <Select
                  value={updated ?? undefined}
                  onValueChange={setUpdated as any}
                >
                  <SelectTrigger className="w-full !h-[38px]">
                    <SelectValue
                      defaultValue=""
                      placeholder="No action"
                      className=""
                    />
                  </SelectTrigger>

                  <SelectContent className="max-h-52 overflow-y-scroll">
                    {["Cascade", "Restrict"].map((name, index) => (
                      <SelectItem key={index} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-sm mt-1 text-gray-dark dark:text-gray-light">
                  <span className="text-black dark:text-white opacity-80">
                    No action
                  </span>
                  : Updating a record from
                  <code className="text-xs bg-slate-100 dark:bg-neutral-800 rounded-md px-1 py-0.5 mx-1">
                    {collection.name}
                  </code>
                  will
                  <span className="text-amber-500 opacity-75 mx-1">
                    raise an error
                  </span>
                  if there are records existing in this table that reference it
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="type"
                  className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5 pb-1"
                >
                  Action if referenced row is removed
                </label>
                <Select
                  value={deleted ?? undefined}
                  onValueChange={setDeleted as any}
                >
                  <SelectTrigger className="w-full !h-[38px]">
                    <SelectValue
                      defaultValue=""
                      placeholder="No action"
                      className=""
                    />
                  </SelectTrigger>

                  <SelectContent className="max-h-52 overflow-y-scroll">
                    {["Cascade", "Restrict", "Set default", "Set NULL"].map(
                      (name, index) => (
                        <SelectItem key={index} value={name}>
                          {name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <p className="text-sm mt-1 text-gray-dark dark:text-gray-light">
                  <span className="text-black dark:text-white opacity-80">
                    No action
                  </span>
                  : Deleting a record from
                  <code className="text-xs bg-slate-100 dark:bg-neutral-800 rounded-md px-1 py-0.5 mx-1">
                    {collection.name}
                  </code>
                  will
                  <span className="text-amber-500 opacity-75 mx-1">
                    raise an error
                  </span>
                  if there are records existing in this table that reference it
                </p>
              </div>
            </>
          ) : null}
        </div>

        <div className="p-6 py-3 border-t-[1.5px] border-slate-100 dark:border-neutral-800 space-x-6 flex">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800 ml-auto"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={disabled()}
            className=""
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
