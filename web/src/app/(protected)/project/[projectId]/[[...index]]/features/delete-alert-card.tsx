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
import { MoonLoader } from "react-spinners";
import { useProjectStore } from "../../../store/project-store";
import { useSelectedRowStore } from "../../../store/selected-row-store";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteRow } from "../../../services/delete-row";
import { formatDeleteWhere } from "../utils/format-delete-where";
import { toast } from "sonner";

type Props = {
  pageName: string;
  totalItems: number;
  filter: string;
  items: any;
  queryKey: (string | number | undefined)[];
  projectId: string;
};
export const DeleteAlertCard = (props: Props) => {
  const { pageName, totalItems, filter, items, projectId, queryKey } = props;

  const [isLoading, setIsLoading] = useState(false);

  const fields = useProjectStore((store) => store.getFields(pageName));

  const queryClient = useQueryClient();

  const { selectedRows, isDeleteOpen, setIsDeleteOpen, removeSelected } =
    useSelectedRowStore();

  const selectedCount = selectedRows.length;

  const isAllSelected =
    totalItems > 0 ? totalItems === selectedRows.length : false;

  const handleDelete = async () => {
    setIsLoading(true);
    const deleteAll = filter
      ? isAllSelected
        ? filter
        : false
      : isAllSelected
      ? true
      : false;
    const selectedRowsData = selectedRows.map((value) => {
      if (value >= 0 && value < items.length) return items[value];
    });
    await deleteRow({
      projectId,
      collectionName: pageName,
      where: !deleteAll
        ? formatDeleteWhere(fields, selectedRowsData)
        : undefined,
      deleteAll,
    })
      .then(async () => {
        toast.success(`Rows deleted successfully`);
        await queryClient.invalidateQueries({ queryKey });
        setIsDeleteOpen(false);
        removeSelected();
      })
      .catch((err: any) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const onClose = () => {
    if (isLoading) return;

    setIsDeleteOpen(false);
  };

  return (
    <AlertDialog open={isDeleteOpen} onOpenChange={() => onClose()} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirm to delete the selected row
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete the selected{" "}
            {selectedCount > 1 ? selectedCount : null} row? <br />
            The action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white hover:bg-slate-100 hover:dark:bg-neutral-800"
          >
            Cancel
          </AlertDialogCancel>

          <Button
            onClick={handleDelete}
            disabled={isLoading}
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
