"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { Add, SearchNormal1, Trash } from "iconsax-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RippleCard } from "@/components/ripple-card";
import { useMemo, useState } from "react";
import { MemberDeleteModel } from "./member-delete-model";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    name: "Olamilekan Nunu",
    role: "administrator",
    joined: "4d",
    email: "nunuolamilekan@gmail.com",
    photoUrl:
      "https://storage.googleapis.com/dashify-b6918.appspot.com/1695293516052-min_1_90.png",
  },
  {
    id: "m5gr84i553",
    name: "Olamilekan Nunu",
    role: "administrator",
    joined: "4d",
    email: "nunuolamilekan@gmail.com",
    photoUrl:
      "https://storage.googleapis.com/dashify-b6918.appspot.com/1695293516052-min_1_90.png",
  },
];

type Payment = {
  id: string;
  name: string;
  role: "administrator" | "editor" | "viewer" | "developer";
  joined: string;
  email: string;
  photoUrl: string;
};

export const InvitationsSection = () => {
  const [userId, setUserId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => setUserId(id);

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id",
        cell: ({ row }) => (
          <p className="text-black dark:text-white">{row.getValue("id")}</p>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <p className="text-black dark:text-white">{row.getValue("email")}</p>
        ),
      },
      {
        accessorKey: "role",
        header: () => {
          return <div className="capitalize">Role</div>;
        },
        cell: ({ row }) => (
          <div className="text-black dark:text-white capitalize">
            {row.getValue("role")}
          </div>
        ),
      },
      {
        id: "photoUrl",
        accessorKey: "photoUrl",
        header: "Invited",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar
              fallback={row.getValue("name")}
              className="h-[30px] w-[30px]"
            >
              <AvatarImage src={row.getValue("photoUrl")} />
            </Avatar>

            <p className="text-black dark:text-white">
              {row.getValue("joined")}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "joined",
        header: () => {
          return <div className="capitalize">joined</div>;
        },
        cell: ({ row }) => (
          <div className="lowercase text-black dark:text-white">
            {row.getValue("joined")}
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
              className="w-[35px] h-[35px] text-black dark:text-white bg-slate-100/0 dark:bg-slate-100/10 flex items-center justify-center transition-transform rounded-full"
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
    state: { columnVisibility: { id: false, joined: false } },
  });

  return (
    <div>
      <TitleSection
        title="Project invitations"
        subtitle="Invitations that have been sent, but not accepted yet. Changed your mind? Pending invitation may be revoked."
        classes={{
          root: "justify-between",
          left: { root: "lg:w-[50%]" },
          right: "w-fit",
        }}
      />

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
                    <TableCell key={cell.id}>
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

      <MemberDeleteModel
        open={!!userId}
        user={userId ? data.find((value) => value.id === userId)! : null}
        isInvitation
        onClose={() => setUserId(null)}
      />
    </div>
  );
};
