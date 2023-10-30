"use client";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import React, { useState } from "react";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";
import { DatabaseForm } from "./database-form";
import { FormStepOne } from "./form-step-one";
import { FormStepTwo } from "./form-step-two";
import { CreateProjectForm } from "./type";

type Props = {
  onClose: () => void;
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

export const CreateCard = (props: Props) => {
  const { onClose } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(0);

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
      database: "",
      host: "",
      port: null,
      databaseName: "",
      username: "",
      password: "",
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      setIsLoading(true);
    },
  });

  const onContinueClick = () => {
    if (active === 0) setActive(1);
  };

  const onCancelClick = () => {
    if (active === 0) onClose();
    else setActive(0);
  };
  return (
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

            {active === 0 ? (
              <Button
                type="button"
                disabled={isLoading}
                onClick={onContinueClick}
                className=""
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit as any}
                className=""
              >
                <MoonLoader
                  size={20}
                  color="white"
                  className="mr-2 text-white"
                  loading={isLoading}
                />
                Create Dash
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
