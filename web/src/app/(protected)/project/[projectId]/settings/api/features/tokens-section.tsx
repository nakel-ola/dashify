"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { RippleCard } from "@/components/ripple-card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Add, Trash } from "iconsax-react";
import { useMemo, useState } from "react";
import { DeleteModel } from "./delete-model";
import { TokensModel } from "./tokens-model";

const data: CorsType[] = [
  {
    id: "m5gr84i9",
    name: "Vercel Token",
    permissions: "editor",
    createdAt: "1 week",
  },
  {
    id: "m5gr84i553",
    name: "Application Token",
    permissions: "editor",
    createdAt: "1 week",
  },
];

type CorsType = {
  id: string;
  name: string;
  permissions: string;
  createdAt: string;
};

type Props = {};
export const TokensSection = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [tokenId, setTokenId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => setTokenId(id);

  const columns = useMemo<ColumnDef<CorsType>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => (
          <p className="text-black dark:text-white">{row.getValue("id")}</p>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="">
            <p className="text-black dark:text-white">{row.getValue("name")}</p>
          </div>
        ),
      },
      {
        accessorKey: "permissions",
        header: "Permissions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-800 rounded w-fit px-2">
            <p className="uppercase text-black dark:text-white">
              {row.getValue("permissions")}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <div className="">
            <p className="text-black dark:text-white">
              {row.getValue("createdAt")}
            </p>
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <RippleCard
              Component="button"
              onClick={() => handleDeleteClick(row.getValue("id"))}
              className="w-[35px] h-[35px] text-black dark:text-white bg-slate-100/50 dark:bg-slate-100/10 flex items-center justify-center transition-transform rounded-full"
            >
              <Trash className="text-red-500" variant="Bold" size={20} />
            </RippleCard>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        id: false,
        email: false,
        photoUrl: false,
      },
    },
  });

  return (
    <div className="">
      <TitleSection
        title="Tokens"
        subtitle="Tokens are used to authenticate apps and scripts to access project data."
        classes={{
          root: "justify-between",
          left: { root: "lg:w-[50%]" },
          right: "w-fit",
        }}
      >
        <Button
          className="flex gap-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <Add />
          Add API token
        </Button>
      </TitleSection>

      <div className="rounded-md border-[1.5px] border-slate-100 dark:border-neutral-800 mt-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.id === "actions"
                          ? "text-right w-fit !bg-green-500"
                          : ""
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TokensModel open={isOpen} onClose={() => setIsOpen(false)} />

      <DeleteModel
        open={!!tokenId}
        isToken
        onClose={() => setTokenId(null)}
        onDeleteClick={() => {}}
      />
    </div>
  );
};
