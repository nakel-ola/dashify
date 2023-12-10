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
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";

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

  const { isPending } = useMutation({
    mutationFn: (newTodo) => {
      return axios.post("/todos", newTodo);
    },
  });

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

    return false;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) onClose();
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
                required
                onChange={(e) => handleChange(index, e.target.value)}
                classes={{ root: "w-full" }}
              />

              <Select
                value={item.role}
                onValueChange={(value) => handleRoleChange(index, value)}
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
                onClick={() => setItems([...items, { ...defaultItem }])}
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
            type="submit"
            disabled={!isPending ? disabled() : isPending}
            className="w-full"
          >
            Send invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
