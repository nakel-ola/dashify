"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { nanoid } from "@/lib/nanoid";
import slugify from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { revalidateTag } from "next/cache";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";
import { createProject } from "../services/create-project";
import { FormStepOne } from "./form-step-one";
import { FormStepTwo } from "./form-step-two";
import { CreateProjectForm } from "./type";
import { Modal } from "@/components/modal";
import { useModelStore } from "../../store/ModelStore";

type Props = {
  // onClose: () => void;
};

const Schema = Yup.object().shape({
  name: Yup.string().min(3),
  database: Yup.string().oneOf(["mongodb", "postgres", "mysql", "cockroachdb"]),
  databaseName: Yup.string().min(3),
  host: Yup.string().min(3),
  port: Yup.number(),
  username: Yup.string().min(3),
  password: Yup.string().min(8),
});

const id = nanoid(5, "abcdefghijklmnopqrstuvwxyz0123456789").toLowerCase();
export const CreateCard = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const { isOpen, setIsOpen } = useModelStore();
  const { toast } = useToast();
  const router = useRouter();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    setFieldValue,
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
        setActive(1);
        return;
      }

      setIsLoading(true);

      await createProject({ ...values, projectId })
        .then((results) => {
          toast({ variant: "default", title: results.message });
          revalidateTag("projects");
          router.push(`/project/${projectId}/overview`);
          setIsOpen(false);
        })
        .catch((err) => {
          console.log(err);
          toast({ variant: "destructive", title: err.message });
        })
        .finally(() => setIsLoading(false));
    },
  });

  const projectId = slugify(values.name) + "-" + id;

  const onContinueClick = () => {
    if (active === 0) setActive(1);
  };

  const onCancelClick = () => {
    if (active === 0) setIsOpen(false);
    else setActive(0);
  };
  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="sm:max-w-[425px] lg:w-[425px]"
    >
      <div>
        <div className="">
          <h2 className="font-sans text-4xl text-black dark:text-white font-semibold">
            Create a new dash
          </h2>
          <p className="text-gray-dark dark:text-gray-light">
            Fill in the details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {active === 0 ? (
            <FormStepOne
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              isLoading={isLoading}
              setFieldValue={setFieldValue}
              values={values}
              projectId={projectId}
            />
          ) : (
            <FormStepTwo
              errors={errors}
              handleBlur={handleBlur}
              handleChange={handleChange}
              isLoading={isLoading}
              values={values}
            />
          )}

          <div className="flex items-center justify-between">
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

            <div className="flex space-x-5">
              <Button
                type="button"
                disabled={isLoading}
                variant="outline"
                onClick={onCancelClick}
                className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800"
              >
                {active === 0 ? "Cancel" : "Go Back"}
              </Button>

              <Button type="submit" disabled={isLoading} className="">
                {active === 0 ? "Continue" : "Create Dash"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
