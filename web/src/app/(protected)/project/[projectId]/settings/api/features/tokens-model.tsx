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
import { MoonLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";
import { useProjectStore } from "@/app/(protected)/project/store/project-store";
import { createToken } from "../../services/create-token";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { CheckIcon } from "lucide-react";
import { Copy } from "iconsax-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const permissions = ["editor", "viewer"] as const;

export const TokensModel = (props: Props) => {
  const { open, onClose } = props;

  const project = useProjectStore((state) => state.project!);

  const [name, setName] = useState("");
  const [permission, setPermission] = useState<
    (typeof permissions)[number] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setCopyValue] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const disabled = () => {
    if (
      name.length >= 3 &&
      (permission === "editor" || permission === "viewer")
    ) {
      return false;
    }

    if (isLoading) return true;

    return true;
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!project || !permission) return;

    createToken({
      name,
      permission,
      projectId: project.projectId,
    })
      .then(async (result) => {
        toast.success("Created token successfully");

        await queryClient.invalidateQueries({
          queryKey: ["project", project?.projectId],
        });

        setToken(result.token);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleClose = () => {
    if (isLoading) return;

    setName("");
    setToken(null);
    setPermission(undefined);
    onClose();
  };

  const handleCopy = () => {
    if (!token) return;

    setCopyValue(token).then(() => {
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    });
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
          <DialogTitle>Create token</DialogTitle>
        </DialogHeader>

        {!token ? (
          <div className="p-4 flex items-center gap-5">
            <CustomInput
              label="Name"
              placeholder='"Employee import", "Website preview" or "PDF generator".'
              value={name}
              required
              disabled={isLoading}
              classes={{ root: "w-full" }}
              onChange={(e) => setName(e.target.value)}
            />

            <Select
              value={permission}
              onValueChange={setPermission as any}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px] !h-11 capitalize mt-8">
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
        ) : (
          <div className="m-4">
            <p className="text-red-500 pb-4">
              Copy the token below – this is your only chance to do so!
            </p>
            <div className=" bg-indigo-50 dark:bg-indigo-100/50 rounded-lg p-4 relative">
              <p className="relative break-all">{token}</p>

              <button
                type="button"
                onClick={() => handleCopy()}
                className="flex items-center bg-white dark:bg-dark px-2 py-1 rounded-md gap-1 absolute bottom-[5px] right-[5px]"
              >
                {copied ? <CheckIcon size={20} /> : <Copy size={20} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        <DialogFooter className="border-t-[1.5px] border-slate-100 dark:border-neutral-800 p-4 py-2 gap-5">
          {!token ? (
            <>
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
                className="w-full"
                onClick={handleSubmit}
              >
                Save
                <MoonLoader
                  size={20}
                  color="white"
                  className="ml-2 text-white"
                  loading={isLoading}
                />
              </Button>
            </>
          ) : (
            <>
              <Button type="button" className="w-full" onClick={handleClose}>
                Close
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
