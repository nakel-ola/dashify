import { Button, buttonVariants } from "@/components/ui/button";
import { useQueries } from "../../../hooks/use-queries";
import { useProjectStore } from "../../../store/project-store";
import { useRowAddStore } from "../../../store/row-add-store";
import {
  Add,
  ArrowDown2,
  DocumentCode,
  DocumentText,
  RowVertical,
} from "iconsax-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {};
export const InsertCard = (props: Props) => {
  const { setRow } = useRowAddStore();

  const [{ projectId, pageName }] = useQueries();

  const sortedFields = useProjectStore((store) => store.getFields(pageName));

  const onClick = (type: "single" | "csv") => {
    setRow({
      field: sortedFields,
      tableName: pageName,
      projectId,
      type,
    });
  };

  return (
    <div className="">
      <Popover>
        <PopoverTrigger className={buttonVariants({ className: "rounded-md" })}>
          Insert
          <ArrowDown2 className="ml-2" />
        </PopoverTrigger>
        <PopoverContent className="p-1">
          <div
            onClick={() => onClick("single")}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-md cursor-pointer transition-all duration-300"
          >
            <RowVertical size={20} />

            <p className="text-sm">Insert row</p>
          </div>
          <div
            onClick={() => onClick("csv")}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-md cursor-pointer transition-all duration-300"
          >
            <DocumentText size={20} />

            <p className="text-sm">Import data from csv</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
