"use client";

import { useRowUpdateStore } from "@/app/(protected)/project/store/row-update-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Fragment, useState, useEffect, useCallback } from "react";
import { FieldCard } from "./field-card";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { clean } from "@/utils/clean";
import { formatDeleteWhere } from "../../utils/format-delete-where";
import { useQueryClient } from "@tanstack/react-query";
import { updateDocument } from "@/app/(protected)/project/services/update-document";
import { toast } from "sonner";

type Props = {
  isMongodb: boolean;
  queryKey: any[];
};
export const RowUpdateCard = (props: Props) => {
  const { isMongodb, queryKey } = props;
  const { row, setRow } = useRowUpdateStore();

  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<{ [key: string]: any }>({});

  const queryClient = useQueryClient();

  const handleClose = () => {
    if (isLoading) return;
    setRow(null);

    setData({});
  };

  const handleSubmit = async () => {
    if (!row) return;
    setIsLoading(true);

    const fields = formatField();

    const where = formatDeleteWhere(row?.field, [fields])[0];

    const changeValues = getDifferentProperties(fields, data);

    const set = Object.entries(changeValues).map(([name, value]) => ({
      name,
      value,
    }));

    updateDocument({
      projectId: row.projectId,
      collectionName: row.tableName,
      where,
      set,
    })
      .then(async (result) => {
        if (result.ok) {
          toast.success(`Row updated successfully`);
          await queryClient.invalidateQueries({ queryKey });
          handleClose();
        } else {
          toast.error(result.message);
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const formatField = useCallback(() => {
    if (!row) return {};

    let results: { [key: string]: any } = {};
    for (let i = 0; i < row.field.length; i++) {
      const field = row.field[i];

      results[field.name] = row.values[field.name];
    }

    return results;
  }, [row]);

  useEffect(() => {
    if (!row) return;

    const fields = formatField();

    setData(
      clean({
        ...fields,
        _id: isMongodb ? null : fields?._id,
      })
    );
  }, [formatField, row, isMongodb]);

  return (
    <Fragment>
      <Sheet open={!!row} onOpenChange={() => handleClose()}>
        <SheetContent className="sm:!w-[700px] sm:max-w-md !p-0">
          <SheetHeader className="p-6 border-b-[1.5px] border-slate-100 dark:border-neutral-800">
            <SheetTitle>
              Update row from
              <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 ml-2">
                {row?.tableName}
              </span>
            </SheetTitle>
          </SheetHeader>

          {row ? (
            <div className="h-full">
              <div className="space-y-5 h-[calc(100%-140px)] overflow-y-scroll py-6">
                {row.field.map((f, index) => (
                  <Fragment key={index}>
                    {isMongodb && f.name === "_id" ? (
                      <Fragment />
                    ) : (
                      <FieldCard
                        {...f}
                        value={data[f.name]}
                        onChange={(value) => {
                          setData({
                            ...data,
                            [f.name]: value,
                          });
                        }}
                      />
                    )}
                  </Fragment>
                ))}
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
                  onClick={handleSubmit}
                  disabled={isLoading}
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
    </Fragment>
  );
};

function getDifferentProperties(obj1: any, obj2: any): any {
  const result: any = {};

  for (const prop in obj1) {
    if (obj2.hasOwnProperty(prop) && obj1[prop] !== obj2[prop]) {
      result[prop] = obj2[prop];
    }
  }

  return result;
}
