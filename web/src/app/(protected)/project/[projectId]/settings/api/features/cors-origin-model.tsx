"use client";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addOriginToProject } from "../../services/add-origin-to-project";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { useToast } from "@/components/ui/use-toast";
import { MoonLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";
import { isValidUrl } from "@/utils/is-valid-url";

type Props = {
  open: boolean;
  onClose: () => void;
};

const permissions = ["allow", "block"] as const;

export const CorsOriginModel = (props: Props) => {
  const { open, onClose } = props;

  const project = useProjectStore((state) => state.project!);

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<
    (typeof permissions)[number] | undefined
  >(undefined);

  const disabled = () => {
    if (
      isValidUrl(input) &&
      (permission === "allow" || permission === "block")
    ) {
      return false;
    }

    if (isLoading) return true;

    return true;
  };

  const handleClose = () => {
    if (isLoading) return;

    setInput("");
    setPermission(undefined);
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!project) return;

    addOriginToProject({
      origin: input,
      permission: permission!,
      projectId: project?.projectId,
    })
      .then(async (result) => {
        toast({
          variant: "default",
          title: "Added origin successfully",
        });

        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });
        handleClose();
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err.message });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value === false) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[525px] p-0">
        <DialogHeader className="border-b-[1.5px] border-slate-100 dark:border-neutral-800 p-4">
          <DialogTitle>Add origin</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <p className="mb-5">
            A URL in the format of protocol://hostname[:port]
          </p>

          <div className="py-4 flex items-center gap-5">
            <CustomInput
              placeholder="https://"
              value={input}
              disabled={isLoading}
              required
              classes={{ root: "w-full" }}
              onChange={(e) => setInput(e.target.value)}
            />

            <Select
              value={permission}
              onValueChange={setPermission as any}
              required
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px] !h-11 capitalize">
                <SelectValue
                  defaultValue="viewer"
                  placeholder="Permissions"
                  className="capitalize"
                />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {permissions.map((role) => (
                  <SelectItem key={role} value={role} className="capitalize">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t-[1.5px] border-slate-100 dark:border-neutral-800 p-4 py-2 gap-5">
          <Button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full"
            variant="ghost"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={disabled()}
            onClick={handleSubmit}
            className="w-full"
          >
            Save
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
