import { IconButton } from "@/components/IconButton";
import { IconNames, Icons } from "@/components/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter } from "@/lib/capitalizeFirstLetter";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  icon: IconNames;
  name: string;
  fields: Fields[];
  onIconClick(): void;
  onTypeChange(value: string, index: number): void;
};

export const SchemaCard = (props: Props) => {
  const { icon, onIconClick, name, fields, onTypeChange } = props;

  const shouldDisabled = (value: string) => {
    if (value.includes("id")) return true;

    return false;
  };

  return (
    <div className="my-2 px-4">
      <div className="flex items-center space-x-2 mt-2">
        <IconButton
          onClick={onIconClick}
          className="bg-transparent dark:bg-transparent hover:bg-project-hover hover:dark:bg-project-hover-dark rounded-md border-[2px] border-project-divide dark:border-project-divide-dark"
        >
          <Icons
            iconName={icon}
            className="text-project-text-color dark:text-project-text-color-dark"
          />
        </IconButton>

        <p className="text-xl text-project-text-color dark:text-project-text-color-dark">
          {capitalizeFirstLetter(name)}
        </p>
      </div>

      <div className="ml-10 flex items-center space-x-2 h-fit relative">
        <span className="absolute top-0 left-[-25px] w-[2px] h-[calc(100%-50px)] bg-project-divide dark:bg-project-divide-dark rounded-bl-lg" />
        <div className="ml-10 mt-4 relative">
          {fields.map((field, index) => (
            <FieldCard
              key={index}
              index={index}
              {...field}
              disabled={shouldDisabled(field.name)}
              onTypeChange={(value) => onTypeChange(value, index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type FieldCardProps = Fields & {
  index: number;
  disabled: boolean;
  onTypeChange(value: string): void;
};

const FieldCard = (props: FieldCardProps) => {
  const { name, type, disabled, onTypeChange } = props;

  const options = [
    "string",
    "number",
    "boolean",
    "array",
    "object",
    "date",
    "enum",
    "null",
  ];

  return (
    <div className="relative">
      <span
        className={cn(
          "absolute -left-[33px] top-[0] translate-y-[-50%] w-8 h-[100%] border-l-[2px] border-b-[2px] border-project-divide dark:border-project-divide-dark rounded-bl-2xl "
        )}
      />
      <div
        className={cn(
          "relative min-h-[50px] w-[300px] my-2 flex items-center ml-3",
          disabled ? "opacity-40" : ""
        )}
      >
        <p className="text-project-text-color dark:text-project-text-color-dark">
          {name}
        </p>

        <Select onValueChange={(value) => onTypeChange(value)}>
          <SelectTrigger
            disabled={disabled}
            className="border-[1.5px] ml-5 mt-1 h-[40px] border-project-divide dark:border-project-divide-dark px-2 py-1 rounded-lg flex items-center w-[100px] ring-project-divide ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 text-project-text-color dark:text-project-text-color-dark"
          >
            <SelectValue placeholder={type} className="" />
          </SelectTrigger>
          <SelectContent className="bg-project-white dark:bg-project-dark border-project-divide dark:border-project-divide-dark">
            {options.map((option, index) => (
              <SelectItem
                key={index}
                value={option}
                className="pl-0 p-2 cursor-pointer hover:bg-project-divide hover:dark:bg-project-divide-dark rounded-md"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
