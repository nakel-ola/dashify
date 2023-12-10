import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  user: {
    email: string;
    name: string;
    photoUrl: string;
    role: string;
  } | null;
  open: boolean;
  onClose: () => void;
  isInvitation?: boolean;

  onDeleteClick: () => void;
};
export const MemberDeleteModel = (props: Props) => {
  const { open, onClose, isInvitation = false, user, onDeleteClick } = props;

  const { project } = useProjectStore();

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>Remove member from project</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="font-medium text-lg">
            {isInvitation
              ? `Do you really want to revoke the invitation sent to ${user?.email}?`
              : `Do you really want to remove ${user?.name} from ${project?.name}?`}
          </p>
          <p className="text-sm text-gray-dark dark:text-gray-light pt-2">
            {isInvitation
              ? `${user?.email} will no longer be able to join the project.`
              : `${user?.name} will lose access to the project and all the related rights and permissions.`}
          </p>

          <div className="border-[1.5px] border-slate-100 dark:border-neutral-800 rounded-lg mt-5 flex items-center gap-2 p-2">
            {!isInvitation ? (
              <Avatar fallback={user?.name} className="h-[35px] w-[35px]">
                <AvatarImage src={user?.photoUrl} />
              </Avatar>
            ) : null}

            <p className="">{isInvitation ? user?.email : user?.name}</p>
          </div>
        </div>

        <DialogFooter className="border-t-[1.5px] border-slate-100 dark:border-neutral-800 p-4 py-2 gap-5">
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
            onClick={onDeleteClick}
            className="w-full bg-red-500 hover:bg-red-500/90"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
