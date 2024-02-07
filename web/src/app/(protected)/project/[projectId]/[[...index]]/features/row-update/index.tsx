"use client";

import { useRowUpdateStore } from "@/app/(protected)/project/store/row-update-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Fragment, useState, useEffect } from "react";
import { FieldCard } from "./field-card";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";

type Props = {
  isMongodb: boolean;
};
export const RowUpdateCard = (props: Props) => {
  const { isMongodb } = props;
  const { row, setRow } = useRowUpdateStore();

  const [data, setData] = useState<{ [key: string]: any }>({});

  const handleClose = () => {
    setRow(null);

    setData({});
  };

  useEffect(() => {
    if (!row) return;

    for (let i = 0; i < row.field.length; i++) {
      const field = row.field[i];

      if (isMongodb && field.name === "_id") continue;
      setData((value) => ({
        ...value,
        [field.name]: row.values[field.name],
      }));
    }
  }, [row, isMongodb]);

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
                  type="submit"
                  // disabled={!isValid || isDisabled()}
                  className=""
                >
                  Save
                  <MoonLoader
                    size={20}
                    color="white"
                    className="ml-2 text-white"
                    loading={false}
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
