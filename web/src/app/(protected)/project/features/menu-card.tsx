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
import { toast } from "sonner";
import { deleteCollection } from "../services/delete-collection";
import { DeleteCollectionCard } from "./delete-collection-card";
import { useState } from "react";

type Props = {
  Icon: Icon;
  name: string;
  showMoreIcon?: boolean;
};
export const MenuCard = (props: Props) => {
  const { Icon, name, showMoreIcon = true } = props;
  const pathname = usePathname();
  const router = useRouter();
  const [{ projectId }] = useQueries();
  const project = useProjectStore((store) => store.project);

  const [isOpen, setIsOpen] = useState(false);

  const isActive = pathname.startsWith(`/project/${projectId}/${name}`);

  const databaseName = project?.database === "mongodb" ? "Collection" : "table";

  const handleDelete = async () => {
    toast.promise(() => deleteCollection({ name, projectId }), {
      loading: `Deleting ${databaseName} ...`,
      success: (data) => {
        return `${databaseName} deleted successfully`;
      },
      error: (error) => `${error.message}`,
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between m-2 mb-3 py-1.5 px-2 hover:bg-slate-100 hover:dark:bg-neutral-800 rounded-lg cursor-pointer mt-auto",
        isActive ? "bg-slate-100 dark:bg-neutral-800" : ""
      )}
      onClick={() => router.push(`/project/${projectId}/${name}`)}
    >
      <div className="flex items-center">
        <Icon
          variant={isActive ? "Bold" : "Outline"}
          size={20}
          className={cn(
            isActive
              ? "text-black dark:text-white"
              : "text-gray-dark dark:text-gray-light"
          )}
        />
        <p
          className={cn(
            "pl-2",
            isActive
              ? "text-black dark:text-white"
              : "text-gray-dark dark:text-gray-light"
          )}
        >
          {name}
        </p>
      </div>

      {showMoreIcon ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-9 h-full ml-auto rotate-90 flex items-center justify-center">
                <More size={20} />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52">
              <DropdownMenuItem>
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
