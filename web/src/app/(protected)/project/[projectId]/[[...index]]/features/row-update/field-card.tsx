import { Input } from "@/components/ui/input";
import { InputTemplate } from "./input-template";
import { TextareaCard } from "./textarea-card";
import { BoolSelectCard } from "./bool-select-card";
import { DatetimePicker } from "./datetime-picker";
import { TimePicker } from "./time-picker";
import { DatePicker } from "./date-picker";
import { v4 } from "uuid";
import { ChangeEvent } from "react";

type Props = Fields & {
  value: any;
  onChange: (value: any) => void;
};

export const FieldCard = (props: Props) => {
  const { name, udtName, isArray, isNullable, isIdentify, value, onChange } =
    props;

  const isNumber =
    [
      "int2",
      "int4",
      "int8",
      "float4",
      "float8",
      "numeric",
      "int",
      "tinyint",
      "smallint",
      "mediumint",
      "bigint",
      "float",
      "double",
      "decimal",
    ].includes(udtName) && !isArray;

  const isBoolean = ["bool", "boolean"].includes(udtName) && !isArray;

  const isString =
    ["text", "varchar", "longtext", "mediumtext", "tinytext"].includes(
      udtName
    ) && !isArray;

  const isDateTime =
    ["timestamp", "timestamptz", "datetime"].includes(udtName) && !isArray;
  const isTime = ["time", "timetz"].includes(udtName) && !isArray;

  const isDate = ["date"].includes(udtName) && !isArray;

  const isUUID = ["uuid"].includes(udtName) && !isArray;

  const isNone =
    !isNumber && !isBoolean && !isString && !isDateTime && !isTime && !isUUID;

  const commmonProps = {
    value: value,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    disabled: isIdentify,
    isNullable,
    placeholder: isNullable ? "NULL" : "",
  };

  return (
    <div className="">
      <InputTemplate name={name} dataType={udtName}>
        {isNumber ? <Input type="number" {...commmonProps} /> : null}
        {isUUID ? (
          <Input
            type="string"
            {...commmonProps}
            endIcon={
              <button
                type="button"
                onClick={() => onChange(v4())}
                className="border border-slate-200 dark:border-neutral-700 rounded-md bg-slate-100 dark:bg-neutral-800 text-xs px-2 py-1 transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                Generate
              </button>
            }
          />
        ) : null}
        {isString ? (
          <TextareaCard {...commmonProps} setNull={() => onChange("")} />
        ) : null}

        {isBoolean ? (
          <BoolSelectCard
            value={value}
            onChange={onChange}
            disabled={isIdentify}
          />
        ) : null}
        {isDateTime ? (
          <DatetimePicker
            value={new Date(value)}
            onChange={onChange}
            disabled={isIdentify}
          />
        ) : null}
        {isTime ? <TimePicker /> : null}
        {isDate ? (
          <DatePicker
            value={new Date(value)}
            onChange={onChange}
            disabled={isIdentify}
          />
        ) : null}
        {isNone ? (
          <TextareaCard {...commmonProps} setNull={() => onChange("")} />
        ) : null}
      </InputTemplate>
    </div>
  );
};
