import { Input } from "@/components/ui/input";
import { TableRow, TableCell } from "@/components/ui/table";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { LinkCard } from "./link-card";
import { DataTypeSelectCard } from "./data-type-select-card";
import { MoreOptionCard } from "./more-option-card";
import type { ColumnType } from "../schema";
import { DefaultValueCard } from "./default-value-card";
import { useForeignStore } from "../../../store/foreign-store";
import { Link21 } from "iconsax-react";

type Props = ColumnType & {
  index: number;
  removeColumn: () => void;
  updateColumn: <T extends keyof ColumnType>(
    key: T,
    value: ColumnType[T]
  ) => void;
};

export const ColumnTable = (props: Props) => {
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
    index,
  } = props;

  const setColumn = useForeignStore((store) => store.setColumn);
  return (
    <TableRow className="hover:bg-transparent hover:dark:bg-transparent">
      <TableCell className="">
        <div className="flex shrink-0">
          <Input
            placeholder="column_name"
            type="text"
            value={name}
            required
            onChange={(e) => updateColumn("name", e.target.value)}
            classes={{ root: "w-[120px]", input: "!h-9" }}
          />

          <div
            onClick={() =>
              setColumn({
                dataType,
                isPrimary,
                name,
                isArray,
                isIdentify,
                isNullable,
                isUnique,
                defaultValue,
                index
              })
            }
            className="bg-slate-100 dark:bg-neutral-800 rounded shrink-0 ml-2 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 h-9 w-9 cursor-pointer"
          >
            <Link21 size={20} />
          </div>

          {/* <LinkCard /> */}
        </div>
      </TableCell>

      <TableCell>
        <DataTypeSelectCard dataType={dataType} updateColumn={updateColumn} />
      </TableCell>

      <TableCell>
        <DefaultValueCard
          isIdentify={isIdentify}
          defaultValue={defaultValue}
          updateColumn={updateColumn}
          dataType={dataType}
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
          isPrimary={isPrimary}
          isUnique={isUnique}
          updateColumn={updateColumn}
          dataType={dataType}
        />
      </TableCell>

      <TableCell className="w-[40px]">
        <button
          type="button"
          onClick={removeColumn}
          className="h-9 w-9 rounded-md flex items-center justify-center bg-slate-100 dark:bg-neutral-800 shrink-0"
        >
          <X size={20} />
        </button>
      </TableCell>
    </TableRow>
  );
};
