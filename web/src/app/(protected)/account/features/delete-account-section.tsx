"use client";

import { useSession } from "next-auth/react";
import { TitleSection } from "./title-section";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { Fragment, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Warning2 } from "iconsax-react";
import { deleteAccount } from "../services/delete-account";
import { useToast } from "@/components/ui/use-toast";
import { useSignOut } from "@/hooks/use-sign-out";

type Props = {};
export const DeleteAccountSection = (props: Props) => {
  const { data } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const signOut = useSignOut();

  const user = data?.user;

  const handleDelete = async () => {
    setIsLoading(true);

    await deleteAccount()
      .then(async () => {
        await signOut({ callbackUrl: "/", redirect: true });
        toast({
          variant: "default",
          title: "Account deleted successfully",
        });
      })
      .catch((err) => {
        toast({ variant: "destructive", title: err.message });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Fragment>
      <TitleSection
        title="Delete account"
        subtitle="Your account will be permanently deleted and access will be lost to any of your teams and data. This action is irreversible."
        classes={{ left: { title: "text-red-500" } }}
      >
        <div className="w-full lg:w-[80%]">
          <div className="rounded-md border-[1.5px] border-slate-100 dark:border-neutral-800 flex items-center space-x-2 cursor-pointer p-5">
            <Avatar
              fallback={
                `${user?.lastName.charAt(0)}` + user?.firstName.charAt(0)
              }
              className="h-[50px] w-[50px]"
            >
              <AvatarImage src={user?.photoUrl} />
            </Avatar>

            <p className="text-lg font-medium text-black dark:text-white">
              {user?.firstName}
            </p>
          </div>

          <div className="flex mt-5">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="w-fit mt-5 ml-auto bg-red-500 hover:bg-red-500/90"
            >
              Delete my account
            </Button>
          </div>
        </div>
      </TitleSection>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="flex items-center gap-3">
            <div className="h-[45px] w-[45px] rounded-full bg-red-500 flex items-center justify-center">
              <Warning2 variant="Bold" className="text-white" />
            </div>

            <p className="text-2xl font-medium">Delete account</p>
          </div>

          <p className="py-3">Are you sure you want to delete your account?</p>

          <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-0" />

          <div className="flex items-center gap-5 mt-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="ml-auto border-slate-100 dark:border-neutral-800 text-black dark:text-white hover:bg-slate-100 dark:hover:bg-neutral-800"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-500/90"
            >
              Delete
              <MoonLoader
                size={20}
                color="white"
                loading={isLoading}
                className="ml-2 text-white"
              />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
