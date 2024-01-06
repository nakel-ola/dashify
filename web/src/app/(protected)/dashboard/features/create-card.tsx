"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { nanoid } from "@/lib/nanoid";
import slugify from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { createProject } from "../services/create-project";
import { FormStepOne } from "./form-step-one";
import { FormStepTwo } from "./form-step-two";
import { CreateProjectForm } from "./type";
import { useModalStore } from "../../store/ModelStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import { uploadImage } from "../services/upload-image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const Schema = Yup.object().shape({
  name: Yup.string().min(3).required(),
  database: Yup.string()
    .oneOf(["mongodb", "postgres", "mysql", "cockroachdb"])
    .required(),
  databaseName: Yup.string().min(3).required(),
  host: Yup.string().min(3).required(),
  port: Yup.number(),
  username: Yup.string().min(3).required(),
  password: Yup.string().min(8).required(),
});

export const CreateCard = (props: Props) => {
  const [active, setActive] = useState(0);
  const { isOpen, setIsOpen } = useModalStore();
  const { toast } = useToast();

  const { data } = useSession();

  const queryClient = useQueryClient();

  const router = useRouter();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    setFieldValue,
    resetForm,
    isValid,
    isSubmitting,
  } = useFormik<CreateProjectForm>({
    initialValues: {
      name: "",
      image: null,
      database: "",
      host: "",
      port: "",
      databaseName: "",
      username: "",
      password: "",
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (active === 0) {
        setActive(0);
        return;
      }

      const projectId =
        slugify(values.name) +
        "-" +
        nanoid(5, "abcdefghijklmnopqrstuvwxyz0123456789").toLowerCase();

      let url: string | null = null;

      if (values.image)
        url = await uploadImage(values.image, data?.user.accessToken!);

      await createProject({ ...values, image: url, projectId })
        .then(async (results) => {
          toast({ variant: "default", title: "Dash created successfully" });

          await queryClient.invalidateQueries({
            queryKey: ["projects"],
          });

          router.push(`/project/${projectId}`);
          handleClose();
        })
        .catch((err) => {
          console.log(err);
          toast({ variant: "destructive", title: err.message });
        });
    },
  });

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleClick = (value: boolean) => {
    if (!value && !isSubmitting) {
      resetForm();
      setActive(0);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  const onCancelClick = () => {
    if (active === 0) handleClick(false);
    else setActive(0);
  };

  const disabled = () => {
    if (active === 0) {
      if (errors.name) return true;
      if (errors.database) return true;
      return false;
    }

    if (isSubmitting) return true;

    return !isValid;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className="!max-w-[450px] !w-[100%] lg:!w-[450px] max-h-[90%] overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Create a new dash</DialogTitle>
          <DialogDescription>
            Fill in the details. Click Create Dash when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6 w-full ">
          {active === 0 ? (
            <FormStepOne
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              isLoading={isSubmitting}
              setFieldValue={setFieldValue}
              values={values}
            />
          ) : (
            <FormStepTwo
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              isLoading={isSubmitting}
              values={values}
            />
          )}

          <div className="flex items-center !justify-between ">
            <div className="flex space-x-2">
              {[0, 1].map((value) => (
                <div
                  key={value}
                  className={cn(
                    "rounded-lg h-2",
                    active === value
                      ? "w-5  bg-black dark:bg-white"
                      : "w-2 bg-slate-200 dark:bg-neutral-800"
                  )}
                ></div>
              ))}
            </div>

            <div className="flex space-x-5 ">
              <Button
                type="button"
                disabled={isSubmitting}
                variant="outline"
                onClick={onCancelClick}
                className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800"
              >
                {active === 0 ? "Cancel" : "Go Back"}
              </Button>

              {active === 0 ? (
                <Button
                  type="button"
                  disabled={disabled()}
                  onClick={() => {
                    if (active === 0) {
                      setActive(1);
                    }
                  }}
                  className=""
                >
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={disabled()} className="">
                  Create Dash
                  <MoonLoader
                    size={20}
                    color="white"
                    className="ml-2 text-white"
                    loading={isSubmitting}
                  />
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
