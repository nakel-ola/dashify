"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomInput from "@/components/custom-input";
import { Add, Trash } from "iconsax-react";
import { RippleCard } from "@/components/ripple-card";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { toast } from "sonner";
import { inviteUser } from "../../services/invite-user";
import { MoonLoader } from "react-spinners";

type Item = {
  email: string;
  role: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const roles = ["administrator", "editor", "viewer"];

const defaultItem = { email: "", role: "viewer" };

export const InvitationModel = (props: Props) => {
  const { open, onClose } = props;

  const [items, setItems] = useState<Item[]>([{ ...defaultItem }]);
  const [isLoading, setIsLoading] = useState(false);

  const project = useProjectStore((state) => state.project!);

  const queryClient = useQueryClient();

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];

    newItems[index].email = value;
    setItems(newItems);
  };

  const handleRoleChange = (index: number, value: string) => {
    const newItems = [...items];

    newItems[index].role = value;
    setItems(newItems);
  };

  const handleRemove = (index: number) => {
    if (isLoading) return;

    const newItems = [...items];

    if (items.length === 1) return;

    newItems.splice(index, 1);
    setItems(newItems);
  };

  const disabled = () => {
    const values = items.filter(
      (item) => !item.email.match(mailformat) || !roles.includes(item.role)
    );

    if (values.length > 0) return true;

    if (isLoading) return true;

    return false;
  };

  const handleClose = () => {
    setItems([{ ...defaultItem }]);
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!project) return;

    inviteUser({
      projectId: project.projectId,
      users: items,
    })
      .then(async (result) => {
        toast.success("Invitations sent successfully");

        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });
        handleClose();
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false && !isLoading) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>Invite members</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-5 pb-4">
              <CustomInput
                placeholder="Email"
                value={item.email}
                type="email"
                autoComplete="email"
                disabled={isLoading}
                required
                onChange={(e) => handleChange(index, e.target.value)}
                classes={{ root: "w-full" }}
              />

              <Select
                value={item.role}
                onValueChange={(value) => handleRoleChange(index, value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[180px] !h-11 capitalize">
                  <SelectValue
                    defaultValue="viewer"
                    placeholder="Roles"
                    className="capitalize"
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {roles.map((role) => (
                    <SelectItem key={role} value={role} className="capitalize">
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {items.length > 1 ? (
                <RippleCard
                  Component="button"
                  onClick={() => handleRemove(index)}
                  className="w-[35px] h-[35px] text-black dark:text-white bg-slate-100/50 dark:bg-slate-100/10 flex items-center justify-center transition-transform rounded-full shrink-0"
                >
                  <Trash className="text-red-500" variant="Bold" size={20} />
                </RippleCard>
              ) : null}
            </div>
          ))}

          <div className="">
            {items.length < 10 ? (
              <Button
                variant="ghost"
                className="w-full hover:scale-100 rounded-lg border-[1.5px] border-slate-100 dark:border-neutral-800 h-10"
                onClick={() =>
                  !isLoading && setItems([...items, { ...defaultItem }])
                }
              >
                <Add /> Add more
              </Button>
            ) : (
              <p className="py-2">10 invite at a time</p>
            )}
          </div>
        </div>

        <DialogFooter className="border-t-[1.5px] border-slate-100 dark:border-neutral-800 p-4 py-2">
          <Button
            type="button"
            disabled={disabled()}
            className="w-full"
            onClick={handleSubmit}
          >
            Send invites
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
