"use client";

import { Add, Filter } from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "../../../store/project-store";
import { useQueries } from "../../../hooks/use-queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/custom-input";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrevious } from "@/hooks/use-previous";
import { cn } from "@/lib/utils";

type Item = {
  name: string;
  operator: Operator;
  value: string;
};

type Operator = {
  symbol: string;
  value: string;
  name: string;
};

const operators = [
  {
    symbol: "=",
    value: "eq",
    name: "equal",
  },
  {
    symbol: "<>",
    value: "neq",
    name: "not equal",
  },
  {
    symbol: ">",
    value: "gt",
    name: "greater then",
  },
  {
    symbol: "<",
    value: "lt",
    name: "less then",
  },
  {
    symbol: ">=",
    value: "gte",
    name: "greater then or equal",
  },
  {
    symbol: "<=",
    value: "lte",
    name: "less then or equal",
  },
];

type Props = {};
export const FilterCard = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [items, setItems] = useState<Item[]>([]);

  const [{ pageName, projectId }] = useQueries();

  const searchParams = useSearchParams();
  const router = useRouter();

  const fields = useProjectStore((store) => store.getFields(pageName)!);

  const filter = searchParams.get("filter");

  const previousFilter = usePrevious(filter);

  const paramsFilter = stringToFilter(filter ?? "");

  const onNameChange = (index: number, value: string) => {
    let arr = [...items];

    arr[index].name = value;

    setItems(arr);
  };

  const onValueChange = (index: number, value: string) => {
    let arr = [...items];

    arr[index].value = value;

    setItems(arr);
  };

  const onOperatorChange = (index: number, value: Operator) => {
    let arr = [...items];

    arr[index].operator = value;

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
      params.set("filter", filterToString(items));
    } else {
      params.delete("filter");
    }

    router.push(
      `/project/${projectId}/${pageName}?` +
        params.toString().replaceAll("%2C", ",").replaceAll("%3A", ":")
    );
  };

  useEffect(() => {
    if (previousFilter !== filter) {
      setItems(stringToFilter(filter ?? ""));
    }
  }, [filter, previousFilter]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "py-1.5 px-2 rounded-lg group flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300",
            paramsFilter.length > 0
              ? "text-indigo-600 bg-indigo-600/10 hover:bg-indigo-600/10 hover:dark:bg-indigo-600/10"
              : "text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800"
          )}
        >
          <Filter className="h-[20px] w-[20px]" />
          {paramsFilter.length > 0
            ? `Filtered by ${paramsFilter.length} rule`
            : "Filter"}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="center" className="w-96">
        {items.length > 0 ? (
          <div className="p-2 space-y-5">
            {items.map((item, index) => (
              <Card
                key={index}
                {...item}
                onNameChange={(value) => onNameChange(index, value)}
                onValueChange={(value) => onValueChange(index, value)}
                onOperatorChange={(value) => onOperatorChange(index, value)}
                removeItem={() => removeItem(index)}
              />
            ))}
          </div>
        ) : (
          <div className="px-2 py-1.5">
            <p className="">No filter applied to this view</p>
            <p className="text-gray-dark dark:text-gray-light text-sm">
              Add a column below to filter the view
            </p>
          </div>
        )}

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-2 py-1.5">
          <Button
            variant="ghost"
            onClick={() =>
              setItems([
                ...items,
                {
                  name: fields[0].name,
                  operator: operators[0],
                  value: "",
                },
              ])
            }
            className="text-black dark:text-white hover:bg-slate-100 hover:dark:bg-neutral-800 gap-2"
          >
            <Add className="h-[20px] w-[20px]" />
            Add filter
          </Button>
          <Button onClick={handleApply}> Apply filter</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type CardProps = Item & {
  onNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onOperatorChange: (value: Operator) => void;
  removeItem: () => void;
};
const Card = (props: CardProps) => {
  const {
    name,
    operator: selectedOperator,
    value,
    onNameChange,
    onValueChange,
    onOperatorChange,
    removeItem,
  } = props;

  const [{ pageName }] = useQueries();

  const fields = useProjectStore((store) => store.getFields(pageName)!);

  const handleChange = (value: string) => {
    const item = operators.find((op) => op.value === value);

    if (!item) return;

    onOperatorChange(item);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={name} onValueChange={onNameChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {fields.map((field, index) => (
            <SelectItem key={index} value={field.name}>
              {field.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedOperator.value} onValueChange={handleChange}>
        <SelectTrigger className="w-[60px] shrink-0">
          <p className="text-lg">{selectedOperator.symbol}</p>
        </SelectTrigger>

        <SelectContent>
          {operators.map((operator, index) => (
            <SelectItem key={index} value={operator.value}>
              [ {operator.symbol} ]
              {operator.value !== selectedOperator.value && (
                <small className="text-gray-dark dark:text-gray-light ml-2">
                  {operator.name}
                </small>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CustomInput
        placeholder="Enter a value"
        value={value}
        type="text"
        autoComplete="email"
        required
        onChange={(e) => onValueChange(e.target.value)}
        classes={{ root: "w-full", input: "!h-9" }}
      />

      <button
        type="button"
        onClick={() => removeItem()}
        className="w-9 h-9 rounded-md flex items-center justify-center bg-slate-100 dark:bg-neutral-800 shrink-0"
      >
        <X />
      </button>
    </div>
  );
};

const filterToString = (items: Item[]) => {
  const results: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    results.push(`${item.name}:${item.operator.value}:${item.value}`);
  }

  return results.join(",");
};

const stringToFilter = (str: string) => {
  const value = str.replaceAll("%2C", ",").replaceAll("%3A", ":");

  const results: Item[] = [];

  const items = value.split(",");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const arr = item.split(":");

    const operator = operators.find((operator) => operator.value === arr[1]);

    if (operator) {
      results.push({
        name: arr[0],
        value: arr[2],
        operator,
      });
    }
  }

  return results;
};
