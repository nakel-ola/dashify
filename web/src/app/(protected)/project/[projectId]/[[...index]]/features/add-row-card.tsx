"use client";

import { useEffect, useState } from "react";
import { useRowAddStore } from "../../../store/row-add-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FieldCard } from "./row-update/field-card";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { addNewDocument } from "../../../services/add-new-document";
import { useQueries } from "../../../hooks/use-queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  queryKey: any[];
};
export const AddRowCard = (props: Props) => {
  const { queryKey } = props;
  const { row, setRow } = useRowAddStore();

  const [{ projectId, pageName }] = useQueries();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<{ [key: string]: any }>({});

  const queryClient = useQueryClient();

  const handleClose = () => {
    if (isLoading) return;
    setRow(null);

    setData({});
  };

  const handleSubmit = () => {
    setIsLoading(true);

    const documents = Object.entries(data).map(([key, value]) => ({
      name: key,
      value: value,
    }));

    addNewDocument({ projectId, collectionName: pageName, documents })
      .then(async () => {
        toast.success(`Row added successfully`);
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

    for (let i = 0; i < row.field.length; i++) {
      const field = row.field[i];
      setData((value) => ({ ...value, [field.name]: null }));
    }
  }, [row]);

  return (
    <Sheet open={row?.type === "single"} onOpenChange={() => handleClose()}>
      <SheetContent className="sm:!w-[700px] sm:max-w-md !p-0">
        <SheetHeader className="p-6 border-b-[1.5px] border-slate-100 dark:border-neutral-800">
          <SheetTitle>
            Add new row to
            <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 ml-2">
              {row?.tableName}
            </span>
          </SheetTitle>
        </SheetHeader>

        {row ? (
          <div className="h-full">
            <div className="space-y-5 h-[calc(100%-140px)] overflow-y-scroll py-6">
              {row.field.map((f, index) => (
                <FieldCard
                  key={index}
                  {...f}
                  value={data[f.name]}
                  disabled={isLoading}
                  onChange={(value) => {
                    setData({
                      ...data,
                      [f.name]: value,
                    });
                  }}
                />
              ))}
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
