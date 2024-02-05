"use client";
import CustomInput from "@/components/custom-input";
import { RippleCard } from "@/components/ripple-card";
import databases from "@/data/databases.json";
import { cn } from "@/lib/utils";
import { FormikErrors } from "formik";
import { TickCircle } from "iconsax-react";
import Image from "next/image";
import React, { Fragment } from "react";
import { CreateProjectForm } from "./type";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

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
export const FormStepTwo = (props: Props) => {
  const { handleBlur, handleChange, values, errors, isLoading, setFieldValue } =
    props;

  const dbImage = databases.find(
    (d) => d.name.toLowerCase() === values.database.toLowerCase()
  );

  return (
    <Fragment>
      <RippleCard
        className={cn(
          "relative border-[1.5px]  w-full h-[80px] shrink-0 rounded-md flex flex-col justify-center items-center transition-all duration-300 border-indigo-600 "
        )}
      >
        <div className="flex flex-col justify-center items-center relative">
          <Image
            src={dbImage?.url!}
            alt=""
            width={40}
            height={40}
            className="h-[40px] w-[40px]"
          />
          <p className="">{dbImage?.name}</p>
        </div>

        <div className="absolute top-0 right-0">
          <TickCircle variant="Bold" className="text-indigo-600" />
        </div>
      </RippleCard>

      <CustomInput
        label="Database name"
        name="databaseName"
        type="string"
        required
        readOnly={isLoading}
        value={values.databaseName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          errors.databaseName && values.databaseName.length > 0
            ? errors.databaseName
            : undefined
        }
      />
      <CustomInput
        label="Database host"
        name="host"
        type="string"
        required
        readOnly={isLoading}
        value={values.host}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.host && values.host.length > 0 ? errors.host : undefined}
      />

      {values.database !== "mongodb" ? (
        <CustomInput
          label="Database port"
          name="port"
          type="string"
          required
          readOnly={isLoading}
          value={values.port}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.port && values.port.toString().length > 0
              ? errors.port
              : undefined
          }
        />
      ) : null}

      <CustomInput
        label="Database username"
        name="username"
        type="string"
        required
        readOnly={isLoading}
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          errors.username && values.username.length > 0
            ? errors.username
            : undefined
        }
      />
      <CustomInput
        label="Database password"
        name="password"
        type="string"
        required
        readOnly={isLoading}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={
          errors.password && values.password.length > 0
            ? errors.password
            : undefined
        }
      />

      {!["mongodb", "mysql"].includes(values.database) ? (
        <div className="flex items-center space-x-2">
          <Switch
            id="ssl"
            checked={values.ssl}
            onCheckedChange={() => setFieldValue("ssl", !values.ssl)}
          />
          <label
            htmlFor="ssl"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            SSL
          </label>
        </div>
      ) : null}
    </Fragment>
  );
};
