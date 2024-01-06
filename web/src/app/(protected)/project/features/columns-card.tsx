"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link21, Setting2, Warning2 } from "iconsax-react";
import { X } from "lucide-react";
import type { SchemaType, ColumnType } from "./create-collection";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "../store/project-store";
import { useState } from "react";

const head = [
  //   {
  //     name: "",
  //     className: "text-left !w-[50px]",
  //   },
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
  const { columns, removeColumn, addColumn, updateColumn } = props;

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

      <div className="mt-1 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent hover:dark:bg-transparent">
              {head.map((value) => (
                <TableHead key={value.name} className={value.className}>
                  {value.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {columns.map((column, index) => (
              <Card
                key={index}
                {...column}
                removeColumn={() => removeColumn(index)}
                updateColumn={(key, value) => updateColumn(index, key, value)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-5 mt-2 divide-y-[1.5px] divide-slate-100 dark:divide-neutral-800">
        {columns.map((column, index) => (
          <MobileCard
            key={index}
            {...column}
            removeColumn={() => removeColumn(index)}
            updateColumn={(key, value) => updateColumn(index, key, value)}
          />
        ))}
      </div>

      <div className="mt-5">
        <Button variant="ghost" type="button" onClick={addColumn}>
          Add column
        </Button>
      </div>
    </div>
  );
};

type CardProps = SchemaType["columns"][0] & {
  removeColumn: () => void;
  updateColumn: <T extends keyof ColumnType>(
    key: T,
    value: ColumnType[T]
  ) => void;
};

const Card = (props: CardProps) => {
  const {
    dataType,
    isPrimary,
    name,
    isArray,
    isIdentify,
    isNullable,
    isUnique,
    defaultValue,
    removeColumn,
    updateColumn,
  } = props;
  return (
    <TableRow>
      <TableCell className="">
        <div className="flex shrink-0">
          <Input
            placeholder="column_name"
            type="text"
            value={name}
            required
            onChange={(e) => updateColumn("name", e.target.value)}
            classes={{ root: "w-[110px]", input: "!h-8" }}
          />

          <LinkCard />
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={dataType}
          onValueChange={(value) => updateColumn("dataType", value)}
        >
          <SelectTrigger className="w-[100px] !h-[34px]">
            <SelectValue defaultValue="" placeholder="---" className="" />
          </SelectTrigger>

          <SelectContent className="max-h-52 overflow-y-scroll">
            {datatypes.map(({ name }, index) => (
              <SelectItem key={index} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <Input
          placeholder="NULL"
          type="text"
          value={defaultValue}
          required
          onChange={(e) => updateColumn("defaultValue", e.target.value)}
          classes={{ root: "w-[100px]", input: "!h-8" }}
        />
      </TableCell>

      <TableCell className="w-[20px]">
        <Checkbox
          checked={isPrimary}
          onCheckedChange={() => updateColumn("isPrimary", !isPrimary)}
          className="w-[20px] h-[20px] rounded-md"
        />
      </TableCell>

      <TableCell className="w-[40px]">
        <MoreOptionCard
          isArray={isArray}
          isIdentify={isIdentify}
          isNullable={isNullable}
          isUnique={isUnique}
          updateColumn={updateColumn}
          dataType={dataType}
        />
      </TableCell>

      <TableCell className="w-[40px]">
        <button
          type="button"
          onClick={removeColumn}
          className="h-8 w-8 rounded-md flex items-center justify-center bg-slate-100 dark:bg-neutral-800 shrink-0"
        >
          <X size={20} />
        </button>
      </TableCell>
    </TableRow>
  );
};

const MobileCard = (props: CardProps) => {
  const {
    dataType,
    name,
    isPrimary,
    isArray,
    isIdentify,
    isNullable,
    isUnique,
    defaultValue,
    removeColumn,
    updateColumn,
  } = props;
  return (
    <div className="border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg p-3">
      <div className="">
        <label
          htmlFor="columns"
          className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5"
        >
          Name
        </label>

        <div className="flex items-center mt-1">
          <Input
            placeholder="column_name"
            type="text"
            value={name}
            required
            onChange={(e) => updateColumn("name", e.target.value)}
            classes={{ root: "w-full", input: "!h-9" }}
          />

          <LinkCard />
        </div>
      </div>

      <div className="flex items-center space-x-5  mt-5 w-full ">
        <div className="">
          <label
            htmlFor="type"
            className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5"
          >
            Type
          </label>
          <Select
            value={dataType}
            onValueChange={(value) => updateColumn("dataType", value)}
          >
            <SelectTrigger className="w-[100px] !h-[38px]">
              <SelectValue defaultValue="" placeholder="---" className="" />
            </SelectTrigger>

            <SelectContent className="max-h-52 overflow-y-scroll">
              {datatypes.map(({ name }, index) => (
                <SelectItem key={index} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="">
          <label
            htmlFor="default-value"
            className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5"
          >
            Default Value
          </label>
          <Input
            placeholder="NULL"
            type="text"
            value={defaultValue}
            required
            onChange={(e) => updateColumn("defaultValue", e.target.value)}
            classes={{ root: "w-[100px]", input: "!h-9" }}
          />
        </div>

        <div>
          <label
            htmlFor="primary"
            className="block text-sm font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5"
          >
            Primary
          </label>

          <div className="h-9 mt-1 flex items-center">
            <Checkbox
              checked={isPrimary}
              onCheckedChange={() => updateColumn("isPrimary", !isPrimary)}
              className="w-[25px] h-[25px] rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        <MoreOptionCard
          isArray={isArray}
          isIdentify={isIdentify}
          isNullable={isNullable}
          isUnique={isUnique}
          updateColumn={updateColumn}
          dataType={dataType}
        />

        <button
          type="button"
          onClick={removeColumn}
          className="h-9 w-9 rounded-md flex items-center justify-center bg-slate-100 dark:bg-neutral-800 shrink-0 ml-2"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const datatypes = [
  {
    name: "int2",
  },
  {
    name: "int4",
  },
  {
    name: "int8",
  },
  {
    name: "float4",
  },
  {
    name: "float8",
  },
  {
    name: "numeric",
  },
  {
    name: "json",
  },
  {
    name: "jsonb",
  },
  {
    name: "text",
  },
  {
    name: "varchar",
  },
  {
    name: "uuid",
  },
  {
    name: "date",
  },
  {
    name: "time",
  },
  {
    name: "timetz",
  },
  {
    name: "timestamp",
  },
  {
    name: "timestamptz",
  },
  {
    name: "bool",
  },
];

const LinkCard = () => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const { project, getCollection } = useProjectStore();

  const collections = project?.collections ?? [];

  const updateCollection = (name: string) => {
    setCollection(getCollection(name) ?? null);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <button
          type="button"
          className="bg-slate-100 dark:bg-neutral-800 rounded shrink-0 ml-2 flex items-center justify-center hover:scale-105 active:scale-95 h-9 w-9 lg:h-8 lg:w-8"
        >
          <Link21 size={20} />
        </button>
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

        <div className="px-4 py-2 gap-2 flex">
          <Button type="submit" className="ml-auto">
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type MoreOptionCardProps = Pick<
  CardProps,
  | "updateColumn"
  | "isArray"
  | "isIdentify"
  | "isNullable"
  | "isUnique"
  | "dataType"
> & {};

type Item = {
  key: "isArray" | "isIdentify" | "isNullable" | "isUnique";
  name: string;
  description: string;
  checked: boolean;
};
const MoreOptionCard = (props: MoreOptionCardProps) => {
  const { isArray, isIdentify, isNullable, isUnique, updateColumn, dataType } =
    props;

  const items = [
    {
      key: "isNullable",
      name: "Is Nullable",
      description:
        "Specify if the column can assume a NULL value if no value is provided",
      checked: isNullable,
    },
    {
      key: "isUnique",
      name: "Is Unique",
      description:
        "Enforce if values in the column should be unique across rows",
      checked: isUnique,
    },
    ["int2", "int4", "int8"].includes(dataType)
      ? {
          key: "isIdentify",
          name: "Is Identify",
          description:
            "Automatically assign a sequential unique number to the column",
          checked: isIdentify,
        }
      : false,
    {
      key: "isArray",
      name: "Define as Array",
      description:
        "Allow column to be defined as variable-length multidimensional arrays",
      checked: isArray,
    },
  ].filter(Boolean) as Item[];

  return (
    <Popover>
      <PopoverTrigger>
        <button
          type="button"
          className="h-9 w-9 lg:w-8 lg:h-8 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 shrink-0"
        >
          <Setting2 className="w-[25px] h-[25px] lg:w-[20px] lg:h-[20px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="!p-0 !w-80">
        <div className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 px-4 py-2">
          <p className="">Extra options</p>
        </div>

        <div className="px-4 py-2 space-y-5">
          {items.map(({ name, description, checked, key }, index) => (
            <div key={index} className="flex ">
              <Checkbox
                className="w-[20px] h-[20px] rounded-md mt-1"
                checked={checked}
                onCheckedChange={() => updateColumn(key, !checked)}
              />

              <div className="ml-2">
                <p className="text-lg text-black dark:text-white">{name}</p>
                <p className="text-sm text-gray-dark dark:text-gray-light">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
