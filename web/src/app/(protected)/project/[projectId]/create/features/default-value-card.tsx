import { Input } from "@/components/ui/input";
import type { ColumnType } from "../schema";
import { List } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

type Props = Pick<ColumnType, "defaultValue" | "isIdentify" | "dataType"> & {
  database: Projects["database"];
  updateColumn: <T extends keyof ColumnType>(
    key: T,
    value: ColumnType[T]
  ) => void;
};
export const DefaultValueCard = (props: Props) => {
  const { updateColumn, isIdentify, defaultValue, dataType, database } = props;

  const isOption = [
    "text",
    "varchar",
    "uuid",
    "time",
    "timestamp",
    "timetz",
    "timestamptz",
  ].includes(dataType);

  const items = {
    text,
    varchar: text,
    time: database === "mysql" ? [time[0]] : time,
    timetz: time,
    timestamp: database === "mysql" ? [time[0]] : time,
    timestamptz: time,
    uuid,
  };
  return (
    <Input
      placeholder="NULL"
      type="text"
      value={defaultValue === null ? "" : defaultValue}
      required={!!isIdentify}
      readOnly={isIdentify}
      disabled={isIdentify}
      onChange={(e) => updateColumn("defaultValue", e.target.value)}
      classes={{ root: "w-[120px]", input: "!h-9", icon: "pl-0" }}
      endIcon={
        isOption ? (
          <Popover>
            <PopoverTrigger>
              <div className="bg-slate-100 dark:bg-neutral-800 px-1 h-7 mt-1 flex items-center justify-center rounded-md -mr-1 cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300">
                <List />
              </div>
            </PopoverTrigger>

            <PopoverContent className="!p-0 !w-80">
              <div className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 px-4 py-2">
                <p className="">Suggested expressions</p>
              </div>

              <div className="px-4 py-2 space-y-5">
                {items[dataType as Options].map(
                  ({ name, description, value }, index) => (
                    <div key={index} className="flex ">
                      <Checkbox
                        id={"suggested-" + index}
                        className="w-[20px] h-[20px] rounded-md mt-1"
                        checked={value === defaultValue}
                        onCheckedChange={() =>
                          updateColumn("defaultValue", value)
                        }
                      />

                      <label htmlFor={"suggested-" + index} className="ml-2">
                        <p className="text-base text-black dark:text-white">
                          {name}
                        </p>
                        <p className="text-sm text-gray-dark dark:text-gray-light">
                          {description}
                        </p>
                      </label>
                    </div>
                  )
                )}
              </div>
            </PopoverContent>
          </Popover>
        ) : null
      }
    />
  );
};

type Options =
  | "text"
  | "varchar"
  | "uuid"
  | "time"
  | "timestamp"
  | "timetz"
  | "timestamptz";

const time = [
  {
    name: "now()",
    value: "now()",
    description: "Return the current date and time",
  },
  {
    name: "(now() at time zone 'utc)",
    value: "(now() at time zone 'utc)",
    description:
      "Return the current date and time based on the specified timezone",
  },
];

const uuid = [
  {
    name: "gen_random_uuid()",
    value: "gen_random_uuid()",
    description: "Generates a version 4 UUID",
  },
];

const text = [
  {
    name: "Set as NULL",
    value: null,
    description: "Set the default value as NULL value",
  },
  {
    name: "Set as empty string",
    value: "",
    description: "Set the default value as empty string",
  },
];
