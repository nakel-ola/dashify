"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Warning2 } from "iconsax-react";
import type { ColumnType, SchemaType } from "../schema";
import { Button } from "@/components/ui/button";
import { ColumnTable } from "./column-table";

const head = [
  {
    name: "Name",
    description:
      "Recommended to use lowercase and use an underscore to separate words e.g. column_name",
  },
  {
    name: "Type",
  },
  {
    name: "Default Value",
    description:
      "Can either be a literal or an expression. When using an expression wrap your expression in brackets, e.g. (gen_random_uuid())",
    className: "whitespace-nowrap",
  },
  {
    name: "Primary",
    className: "",
  },
  {
    name: "",
    className: "text-left !w-[40px]",
  },
  {
    name: "",
    className: "text-left !w-[40px]",
  },
];

type Props = {
  database: Projects["database"];
  columns: SchemaType["columns"];
  removeColumn: (index: number) => void;
  addColumn: () => void;
  updateColumn: <T extends keyof ColumnType>(
    index: number,
    key: T,
    value: ColumnType[T]
  ) => void;
};
export const ColumnsCard = (props: Props) => {
  const { columns, removeColumn, addColumn, updateColumn, database } = props;

  const hasPrimary = !!columns.find((column) => column.isPrimary === true);
  return (
    <div className="">
      <label
        htmlFor="columns"
        className="block text-base font-semibold leading-6 text-black dark:text-white"
      >
        Columns
      </label>

      {!hasPrimary ? (
        <div className="border-[1.5px] border-amber-700 rounded-lg bg-amber-700/10 dark:bg-amber-600/10 p-5 flex gap-5 my-4">
          <Warning2 className="text-amber-900 shrink-0 mt-1" />

          <div className="">
            <p className="text-amber-800 dark:text-amber-700">
              Warning: No primary keys selected
            </p>
            <p className="text-amber-600 dark:text-amber-500 text-sm">
              Tables require at least one column as a primary key in order to
              uniquely identify each row. Without a primary key, you will not be
              able to update or delete rows from the table.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-1 border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent hover:dark:bg-transparent">
              {head.map((value, index) => (
                <TableHead key={index} className={value.className}>
                  {value.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {columns.map((column, index) => (
              <ColumnTable
                key={index}
                {...column}
                index={index}
                database={database}
                removeColumn={() => removeColumn(index)}
                updateColumn={(key, value) => updateColumn(index, key, value)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5">
        <Button variant="ghost" type="button" onClick={addColumn}>
          Add column
        </Button>
      </div>
    </div>
  );
};
