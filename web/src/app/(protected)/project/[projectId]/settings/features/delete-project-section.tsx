"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "../../../store/project-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Warning2 } from "iconsax-react";
import { MoonLoader } from "react-spinners";

type Props = {};
export const DeleteProjectSection = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { project } = useProjectStore();

  if (!project) return <Fragment />;

  const handleDelete = async () => {
    setIsLoading(true);

    // await deleteAccount()
    //   .then(async () => {
    //     await signOut({ callbackUrl: "/", redirect: true });
    //     toast({
    //       variant: "default",
    //       title: "Account deleted successfully",
    //     });
    //   })
    //   .catch((err) => {
    //     toast({ variant: "destructive", title: err.message });
    //   })
    //   .finally(() => setIsLoading(false));
  };
  return (
    <Fragment>
      <hr className="h-[1px] bg-slate-100 dark:bg-neutral-800 border-0 outline-none my-8" />
      <TitleSection
        title="Delete project"
        subtitle="The project will be permanently deleted, including all the metadata, resources and stats within it. This action is irreversible."
        classes={{ left: { root: "lg:w-[50%]", title: "text-red-500" } }}
      >
        <div className="w-full">
          <div className="rounded-md border-[1.5px] border-slate-100 dark:border-neutral-800 flex flex-col   cursor-pointer p-5">
            <p className="text-lg font-medium text-black dark:text-white">
              {project?.name}
            </p>
            <p className="text-base text-gray-dark dark:text-gray-light">
              <strong className="font-medium">Last update: </strong>
              {new Date(project?.createdAt!).toDateString()}
            </p>
          </div>

          <div className="flex mt-5">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="w-fit mt-5 ml-auto bg-red-500 hover:bg-red-500/90"
            >
              Delete my project
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

            <p className="text-2xl font-medium">Delete project</p>
          </div>

          <p className="py-3">Are you sure you want to delete your project?</p>

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
