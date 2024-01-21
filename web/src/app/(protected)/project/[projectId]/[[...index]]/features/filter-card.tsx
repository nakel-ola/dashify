"use client";

import { Add, Filter } from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
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

  const [{ pageName }] = useQueries();

  const fields = useProjectStore((store) => store.getFields(pageName)!);

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

  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 px-2 text-black dark:text-white hover:bg-slate-200/60 hover:dark:bg-neutral-800 rounded-lg group flex items-center gap-2">
          <Filter className="h-[20px] w-[20px]" />
          Filter
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
