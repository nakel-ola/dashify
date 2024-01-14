import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown2, Edit, Trash } from "iconsax-react";
import { Fragment, useState } from "react";
import { ColumnDeleteCard } from "./column-delete-card";

type Props = Fields & {
  projectId: string;
  tableName: string;
  isMongodb: boolean;
};
export const HeaderCard = (props: Props) => {
  const { name, udtName, projectId, tableName, isMongodb } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <div className="min-w-[250px] h-[43px] px-3 bg-white dark:bg-black border-y-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 py-2">
          <p className="">{name}</p>

          <small className="text-gray-dark dark:text-gray-light text-xs">
            {udtName}
          </small>
        </div>

        {!isMongodb ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-[40px] flex items-center justify-center hover:bg-slate-100 hover:dark:bg-neutral-800 py-1 rounded-md">
                <ArrowDown2 className="w-[20px] h-[20px]" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              sideOffset={15}
              align="end"
              className="w-60 h-fit"
            >
              <DropdownMenuItem>
                <Edit size={20} className="mr-2" />
                Edit Column
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <Trash className="text-red-500 mr-2" size={20} />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <ColumnDeleteCard
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        name={name}
        projectId={projectId}
        tableName={tableName}
      />
    </Fragment>
  );
};
