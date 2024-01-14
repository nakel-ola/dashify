import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoonLoader } from "react-spinners";
import { editCollection } from "../../../services/edit-collection";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  name: string;
  projectId: string;
  tableName: string;
};
export const ColumnDeleteCard = (props: Props) => {
  const { isOpen, setIsOpen, name, tableName, projectId } = props;

  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsLoading(true);

    await editCollection({
      name: tableName,
      projectId,
      columns: [{ name, type: "drop" }],
    })
      .then(async () => {
        toast.success(`${name} deleted successfully`);
        await queryClient.invalidateQueries({
          queryKey: ["project", projectId],
        });

        setIsOpen(false);
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
            Confirm deletion of column {`"${name}"`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the selected column? <br />
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
