import { IconButton } from "@/components/IconButton";
import { ProjectButton } from "@/components/ui/project-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "@/lib/axios";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { convertObjectToArray } from "@/lib/convertObjectToArray";
import truncate from "@/lib/truncate";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowLeft2, ArrowRight2, Filter } from "iconsax-react";
import React, { Fragment } from "react";
import ReactLoading from "react-loading";
import { Navbar } from "./Navbar";

type Props = {
  onMenuClick: () => void;
  collection: Collection;
  projectId: string;
  database: string;
};

const limit = 10;

export const PageCard = (props: Props) => {
  const { onMenuClick, collection, projectId, database } = props;

  const { fields, name } = collection;

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ["projects-collection", projectId, name],
    queryFn: async ({ pageParam = 0 }) => {
      const url = `/projects/collection/${projectId}?collectionName=${name}&database=${database}&offset=${pageParam}&limit=${limit}`;

      const { data } = await axios.get<any[]>(url);

      return data;
    },
  });

  const items = data?.pages.flatMap((page) => page) ?? [];

  const canShowField = (type: string) => {
    if (type === "object") return false;
    if (type === "array") return false;

    return true;
  };

  const canShowValue = (value: any) => {
    if (Array.isArray(value)) return false;
    if (typeof value === "object") return false;

    return true;
  };

  return (
    <Fragment>
      <Navbar title={capitalizeFirstLetter(name)} onMenuClick={onMenuClick} />

      <main className="max-h-[calc(100vh-50px)] overflow-y-scroll">
        {/* <TitleCard title={capitalizeFirstLetter(name)} /> */}

        <div className="p-4 flex justify-between">
          <div className="flex space-x-5">
            <ProjectButton variant="outline">
              {" "}
              <Filter className="mr-2" /> Filters
            </ProjectButton>
            <ProjectButton>Add Record</ProjectButton>
          </div>

          <div className="flex items-center space-x-5">
            <p className="">50 rows</p>

            <IconButton>
              <ArrowLeft2 />
            </IconButton>
            <IconButton>
              <ArrowRight2 />
            </IconButton>
          </div>
        </div>

        <div className="mt-5 px-4">
          <Table>
            <TableHeader className="dark:hover:bg-transparent">
              <TableRow className="dark:hover:bg-transparent border-project-hover dark:border-project-hover-dark">
                {fields.map(
                  (field, index) =>
                    canShowField(field.type) && (
                      <TableHead
                        key={index}
                        className="text-project-text-color dark:text-project-text-color-dark"
                      >
                        {capitalizeFirstLetter(field.name ?? "")}
                      </TableHead>
                    )
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={index}
                  className="dark:hover:bg-transparent border-project-hover dark:border-project-hover-dark"
                >
                  {convertObjectToArray(item).map(
                    (value, inx) =>
                      canShowValue(value) && (
                        <TableCell
                          key={inx}
                          className="whitespace-nowrap text-project-text-color dark:text-project-text-color-dark"
                        >
                          {value ? truncate(value ?? "", 20) : "null"}
                        </TableCell>
                      )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {isLoading ? (
            <div className="grid place-items-center mt-5 w-full h-[100px]">
              <ReactLoading
                type="spinningBubbles"
                width={50}
                height={50}
                color="gray"
              />
            </div>
          ) : null}
        </div>
      </main>
    </Fragment>
  );
};
