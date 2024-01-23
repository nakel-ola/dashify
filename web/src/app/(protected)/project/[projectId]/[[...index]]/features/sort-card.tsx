"use client";

import { ArrowDown2, Sort } from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "../../../store/project-store";
import { useQueries } from "../../../hooks/use-queries";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePrevious } from "@/hooks/use-previous";

type Item = {
  name: string;
  ascending: boolean;
};

type Props = {};
export const SortCard = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);

  const [{ pageName, projectId }] = useQueries();

  const searchParams = useSearchParams();

  const router = useRouter();

  const sort = searchParams.get("sort");

  const previousSort = usePrevious(sort);

  const paramsSort = stringToSort(sort ?? "");

  const fields = useProjectStore((store) => store.getFields(pageName)!);

  const onAscendingChange = (index: number) => {
    let arr = [...items];

    arr[index].ascending = !arr[index].ascending;

    setItems(arr);
  };

  const removeItem = (index: number) => {
    let arr = [...items];

    arr.splice(index, 1);

    setItems(arr);
  };

  const handleApply = () => {
    // Create a new URLSearchParams object based on the current query string.
    const params = new URLSearchParams(searchParams);

    if (items.length > 0) {
      params.set("sort", sortToString(items));
    } else {
      params.delete("sort");
    }

    router.push(
      `/project/${projectId}/${pageName}?` +
        params.toString().replaceAll("%2C", ",").replaceAll("%3A", ":")
    );
  };

  useEffect(() => {
    if (previousSort !== sort) {
      setItems(stringToSort(sort ?? ""));
    }
  }, [sort, previousSort]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "py-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2 ",
            paramsSort.length > 0
              ? "text-indigo-600 bg-indigo-600/10 hover:bg-indigo-600/10 hover:dark:bg-indigo-600/10"
              : ""
          )}
        >
          <Sort className="h-[20px] w-[20px]" />
          {paramsSort.length > 0
            ? `Sorted by ${paramsSort.length} rule`
            : "Sort"}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="center" className="w-96">
        {items.length > 0 ? (
          <div className="p-2 space-y-2">
            {items.map((item, index) => (
              <Card
                key={index}
                {...item}
                onAscendingChange={() => onAscendingChange(index)}
                removeItem={() => removeItem(index)}
              />
            ))}
          </div>
        ) : (
          <div className="px-2 py-1.5">
            <p className="">No sort applied to this view</p>
            <p className="text-gray-dark dark:text-gray-light text-sm">
              Add a column below to sort the view
            </p>
          </div>
        )}

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md bg-slate-100 dark:bg-neutral-800 p-1.5 px-2">
              <p className="text-black dark:text-white">
                Pick a column to sort by
              </p>

              <ArrowDown2 />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[210px] max-h-[180px] overflow-y-scroll">
              {fields.map((field, index) => (
                <DropdownMenuItem
                  key={index}
                  className="p-2"
                  onClick={() =>
                    setItems([...items, { name: field.name, ascending: true }])
                  }
                >
                  {field.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleApply}> Apply sorting</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type CardProps = Item & {
  removeItem: () => void;
  onAscendingChange: () => void;
};
const Card = (props: CardProps) => {
  const { name, ascending, removeItem, onAscendingChange } = props;

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center justify-between w-full">
        <p className="text-black dark:text-white">
          {" "}
          <small className="text-gray-dark dark:text-gray-light">
            sort by
          </small>{" "}
          {name}
        </p>

        <div className="flex items-center gap-2">
          <Label htmlFor="ascending">ascending</Label>
          <Switch
            id="ascending"
            checked={ascending}
            onCheckedChange={() => onAscendingChange()}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => removeItem()}
        className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-neutral-800 shrink-0"
      >
        <X />
      </button>
    </div>
  );
};

const sortToString = (items: Item[]) => {
  const results: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    results.push(`${item.name}:${item.ascending ? "asc" : "desc"}`);
  }

  return results.join(",");
};

const stringToSort = (str: string) => {
  const value = str.replaceAll("%2C", ",").replaceAll("%3A", ":");

  const results: Item[] = [];

  const items = value.split(",");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const arr = item.split(":");

    if (arr.length === 2) {
      results.push({
        name: arr[0],
        ascending: arr[1] === "asc" ? true : false,
      });
    }
  }

  return results;
};
