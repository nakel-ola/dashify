import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  cors: {
    id: string;
    url: string;
    createdAt: string;
  } | null;
  open: boolean;
  onClose: () => void;
  isInvitation?: boolean;

  onDeleteClick: () => void;
};
export const DeleteModel = (props: Props) => {
  const { open, onClose, cors, onDeleteClick } = props;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) onClose();
      }}
    >
      <DialogContent className="max-w-[90%] md:max-w-[425px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>Delete CORS origin</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="font-medium text-lg">
            Do you really want to delete this CORS origin?
          </p>

          <p className="text-sm text-gray-dark dark:text-gray-light pt-2">
            This action cannot be undone.
          </p>
        </div>

        <DialogFooter className="border-t-[1.5px] border-slate-100 dark:border-neutral-800 p-4 py-2 gap-5 flex flex-row">
          <Button
            type="button"
            onClick={onClose}
            className="w-full text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full bg-red-500 hover:bg-red-500/90"
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
