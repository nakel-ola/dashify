import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoonLoader } from "react-spinners";

type Props = {
  open: boolean;
  onClose: () => void;
  isToken?: boolean;
  isLoading: boolean;
  onDeleteClick: () => void;
};
export const DeleteModel = (props: Props) => {
  const { open, onClose, onDeleteClick, isToken, isLoading } = props;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false && !isLoading) onClose();
      }}
    >
      <DialogContent className="max-w-[90%] md:max-w-[425px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>
            Delete {isToken ? "API token" : "CORS origin"}{" "}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="font-medium text-lg">
            Do you really want to delete this{" "}
            {isToken ? "API token" : "CORS origin"}?
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full bg-red-500 hover:bg-red-500/90"
            onClick={onDeleteClick}
            disabled={isLoading}
          >
            Delete
            <MoonLoader
              size={20}
              color="white"
              className="ml-2 text-white"
              loading={isLoading}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
