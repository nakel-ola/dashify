import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCollection } from "../services/delete-collection";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  name: string;
  databaseName: string;
  projectId: string;
};
export const DeleteCollectionCard = (props: Props) => {
  const { isOpen, setIsOpen, name, databaseName, projectId } = props;

  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteCollection({ name, projectId })
      .then(async () => {
        toast.success(`${name} deleted successfully`);
        await queryClient.invalidateQueries({
          queryKey: ["project", projectId],
        });

        router.push(`/project/${projectId}`);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm deletion of {databaseName} {`"${name}"`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the selected {databaseName}? <br />
            The action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-100 hover:dark:bg-neutral-800">
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-500"
          >
            Delete
            <MoonLoader
              size={20}
              color="white"
              className="ml-2 text-white"
              loading={isLoading}
            />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
