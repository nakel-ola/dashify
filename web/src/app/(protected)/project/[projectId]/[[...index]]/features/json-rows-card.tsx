"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueries } from "../../../hooks/use-queries";
import { useRowAddStore } from "../../../store/row-add-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { BoolSelectCard } from "./row-update/bool-select-card";
import { DatetimePicker } from "./row-update/datetime-picker";
import { TextareaCard } from "./row-update/textarea-card";
import { addNewDocument } from "../../../services/add-new-document";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useRefetchCollections } from "../../../hooks/use-refetch-collections";

type ItemType = {
  name: string;
  type: (typeof datatypes)[number];
  value: any;
};
type Props = {
  queryKey: any[];
};
export const JsonRowsCard = (props: Props) => {
  const { queryKey } = props;
  const { row, setRow } = useRowAddStore();

  const [{ projectId, pageName }] = useQueries();

  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ItemType[]>([
    {
      name: "",
      type: "string",
      value: null,
    },
  ]);

  const queryClient = useQueryClient();

  const { refetch } = useRefetchCollections();

  const updatedItem = (
    index: number,
    key: "type" | "value" | "name",
    value: any
  ) => {
    let newItems = [...items];

    newItems[index][key] = value;

    setItems(newItems);
  };

  const removeItem = (index: number) => {
    let newItems = [...items];

    newItems.splice(index, 1);

    setItems(newItems);
  };

  const handleClose = () => {
    if (isLoading) return;
    setRow(null);
  };

  const handleSubmit = () => {
    setIsLoading(true);

    const documents = items.map((item) => ({
      name: item.name,
      value: item.value,
    }));

    addNewDocument({ projectId, collectionName: pageName, documents })
      .then(async () => {
        toast.success(`Row added successfully`);
        if (row?.field.length === 0) await refetch();
        await queryClient.invalidateQueries({ queryKey });

        handleClose();
      })
      .catch((err: any) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!row) return;
    if (row.field.length === 0) return;

    setItems([
      ...(row.field
        .map((field) =>
          field.name !== "_id"
            ? {
                name: field.name,
                type: field.type as ItemType["type"],
                value: null,
              }
            : false
        )
        .filter(Boolean) as ItemType[]),
    ]);
  }, [row]);

  return (
    <Sheet open={row?.type === "json"} onOpenChange={() => handleClose()}>
      <SheetContent className="w-full lg:!w-[700px] sm:max-w-xl !p-0">
        <SheetHeader className="p-6 border-b-[1.5px] border-slate-100 dark:border-neutral-800">
          <SheetTitle>
            Add new rows to
            <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 ml-2">
              {row?.tableName}
            </span>
          </SheetTitle>
        </SheetHeader>

        {row ? (
          <div className="h-full">
            <div className="space-y-5 h-[calc(100%-140px)] overflow-y-scroll p-6">
              {items.map((item, index) => (
                <div key={index} className="flex gap-5">
                  <Input
                    placeholder="Name"
                    type="text"
                    value={item.name}
                    required
                    onChange={(e) => updatedItem(index, "name", e.target.value)}
                    classes={{ root: "w-[100px] shrink-0", input: "!h-9" }}
                  />
                  <Select
                    value={item.type}
                    onValueChange={(value) => updatedItem(index, "type", value)}
                  >
                    <SelectTrigger className="w-[100px] !h-[38px] shrink-0">
                      <SelectValue
                        defaultValue=""
                        placeholder="---"
                        className=""
                      />
                    </SelectTrigger>

                    <SelectContent className="max-h-52 overflow-y-scroll">
                      {datatypes.map((name, index) => (
                        <SelectItem key={index} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {item.type === "boolean" ? (
                    <BoolSelectCard
                      value={item.value}
                      onChange={(value) => updatedItem(index, "value", value)}
                    />
                  ) : null}

                  {item.type === "number" ? (
                    <Input
                      placeholder="value"
                      type="number"
                      value={item.value}
                      required
                      onChange={(e) =>
                        updatedItem(index, "value", e.target.value)
                      }
                      classes={{ root: "w-full", input: "!h-9" }}
                    />
                  ) : null}

                  {item.type === "string" ? (
                    <Input
                      placeholder="value"
                      type="text"
                      value={item.value}
                      required
                      onChange={(e) =>
                        updatedItem(index, "value", e.target.value)
                      }
                      classes={{ root: "w-full", input: "!h-9" }}
                    />
                  ) : null}

                  {item.type === "Date" ? (
                    <DatetimePicker
                      value={item.value}
                      onChange={(value) => updatedItem(index, "value", value)}
                    />
                  ) : null}

                  {["array", "object"].includes(item.type) ? (
                    <TextareaCard
                      value={item.value}
                      className="w-full"
                      onChange={(e) =>
                        updatedItem(index, "value", e.target.value)
                      }
                    />
                  ) : null}

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="h-9 w-9 rounded-md flex items-center justify-center bg-slate-100 dark:bg-neutral-800 shrink-0"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}

              <div className="mt-5">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() =>
                    setItems([
                      ...items,
                      { name: "", type: "string", value: null },
                    ])
                  }
                >
                  Add column
                </Button>
              </div>
            </div>
            <div className="p-6 py-3 border-t-[1.5px] border-slate-100 dark:border-neutral-800 space-x-6 flex">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800 ml-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className=""
              >
                Save
                <MoonLoader
                  size={20}
                  color="white"
                  className="ml-2 text-white"
                  loading={isLoading}
                />
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

const datatypes = [
  "string",
  "number",
  "boolean",
  "array",
  "Date",
  "object",
] as const;
