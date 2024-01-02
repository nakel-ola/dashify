"use client";

import CustomInput from "@/components/custom-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toBase64 } from "@/lib/to-base64";
import { FormikErrors } from "formik";
import Image from "next/image";
import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { DatabaseCard } from "./database-card";
import { CreateProjectForm } from "./type";

type Props = {
  isLoading: boolean;
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  values: CreateProjectForm;
  errors: FormikErrors<CreateProjectForm>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<CreateProjectForm>>;
};

export const FormStepOne = (props: Props) => {
  const { handleBlur, handleChange, isLoading, errors, values, setFieldValue } =
    props;

  const [url, setUrl] = useState<string | ArrayBuffer>("");

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      setFieldValue("image", fileList[0]);

      handleConvert(fileList[0]);
    }
  };

  const handleConvert = async (file: File | Blob) => {
    const newUrl = await toBase64(file);
    setUrl(newUrl);
  };

  useEffect(() => {
    if (values.image) {
      handleConvert(values.image);
    }
  }, [values.image]);
  return (
    <Fragment>
      <div className="">
        <label
          htmlFor="logo"
          className="block text-base font-semibold leading-6 text-black dark:text-white"
        >
          Logo
        </label>

        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          multiple={false}
          className="hidden"
          onChange={(e) => onAvatarChange?.(e)}
        />

        <div className="flex items-center space-x-4 mt-2">
          <Avatar className="h-[60px] w-[60px] p-0">
            <AvatarImage src={url.toString()} alt="" />
            <AvatarFallback className="p-0">
              <Image
                src="/default-avatar.svg"
                alt=""
                width={200}
                height={200}
                className="h-full w-full object-cover grayscale dark:grayscale-0 dark:invert"
              />
            </AvatarFallback>
          </Avatar>

          <label
            htmlFor="image"
            className="bg-slate-100 dark:bg-neutral-800 rounded-lg px-2 py-2 hover:scale-[1.02] active:scale-[0.99] cursor-pointer transition-transform duration-300"
          >
            {" "}
            Change image
          </label>
        </div>
      </div>
      <CustomInput
        label="Name"
        name="name"
        type="string"
        required
        readOnly={isLoading}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name && values.name.length > 0 ? errors.name : undefined}
        showErrorMessage={false}
      />

      <div>
        <label
          htmlFor="name"
          className="block text-base font-semibold leading-6 text-black dark:text-white"
        >
          Database
        </label>

        <DatabaseCard
          active={values.database}
          onChange={(value) => setFieldValue("database", value)}
        />
      </div>
    </Fragment>
  );
};
