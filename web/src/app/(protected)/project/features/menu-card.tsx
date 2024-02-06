import { usePathname, useRouter } from "next/navigation";
import { useQueries } from "../hooks/use-queries";
import { useProjectStore } from "../store/project-store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { More, Edit, Trash, Icon } from "iconsax-react";
import { DeleteCollectionCard } from "./delete-collection-card";
import { useState } from "react";
import truncate from "@/lib/truncate";

type Props = {
  Icon: Icon;
  name: string;
  href: string;
  showMoreIcon?: boolean;
};
export const MenuCard = (props: Props) => {
  const { Icon, name, href, showMoreIcon = true } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [{ projectId }] = useQueries();
  const project = useProjectStore((store) => store.project);

  const [isOpen, setIsOpen] = useState(false);

  const basePath = `/project/${projectId}/${href}`;

  const isActive = pathname.startsWith(basePath);

  const databaseName = project?.database === "mongodb" ? "Collection" : "table";

  return (
    <div
      className={cn(
        "flex items-center justify-between m-2 mb-3 py-1.5 px-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer mt-auto",
        isActive ? "bg-slate-100 dark:bg-neutral-800" : ""
      )}
    >
      <div
        onClick={() => router.push(basePath)}
        className="flex items-center w-full"
      >
        <Icon
          variant={isActive ? "Bold" : "Outline"}
          size={20}
          className={cn(
            "shrink-0",
            isActive
              ? "text-black dark:text-white"
              : "text-gray-dark dark:text-gray-light"
          )}
        />
        <p
          className={cn(
            "pl-2 whitespace-nowrap overflow-ellipsis overflow-hidden text-sm",
            isActive
              ? "text-black dark:text-white"
              : "text-gray-dark dark:text-gray-light"
          )}
        >
          {truncate(name, 22)}
        </p>
      </div>

      {showMoreIcon ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="shrink-0">
              <div className="w-5 h-full ml-auto rotate-90 flex items-center justify-center shrink-0">
                <More size={20} />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52">
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/project/${projectId}/edit/${name}`)
                }
              >
                <Edit size={20} className="mr-2" />
                Edit {databaseName}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="w-full"
                onClick={() => setIsOpen(true)}
              >
                <Trash className="text-red-500 mr-2" size={20} />
                Delete {databaseName}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteCollectionCard
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            name={name}
            databaseName={databaseName}
            projectId={projectId}
          />
        </>
      ) : null}
    </div>
  );
};
