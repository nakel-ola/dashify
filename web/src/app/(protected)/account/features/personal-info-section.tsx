"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TitleSection } from "./title-section";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/custom-input";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { useEffectOnce } from "usehooks-ts";
import { clean } from "@/utils/clean";
import { updateUser } from "../services/update-user";
import { useToast } from "@/components/ui/use-toast";

const Schema = Yup.object().shape({
  firstName: Yup.string().min(3).max(50).required("First Name is required"),
  lastName: Yup.string().min(3).max(50).required("Last Name is required"),
});

type FormType = Yup.InferType<typeof Schema>;

type Props = {};
export const PersonalInfoSection = (props: Props) => {
  const { data, update } = useSession();
  const { toast } = useToast();

  const user = data?.user;

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isValid,
    isSubmitting,
    setFieldValue,
  } = useFormik<FormType>({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const args = clean({
        firstName:
          values.firstName !== user?.firstName ? values.firstName : null,
        lastName: values.lastName !== user?.lastName ? values.lastName : null,
      });

      await updateUser(args)
        .then(async () => {
          await update({ ...data, user: { ...user, ...args } });
          toast({
            variant: "default",
            title: "Details updated successfully",
          });
        })
        .catch((err) => {
          toast({ variant: "destructive", title: err.message });
        });
    },
  });

  const isDisabled = () => {
    if (values.firstName !== user?.firstName) return false;
    if (values.lastName !== user?.lastName) return false;

    if (isSubmitting) return true;

    return true;
  };

  useEffectOnce(() => {
    setFieldValue("firstName", user?.firstName);
    setFieldValue("lastName", user?.lastName);
  });

  return (
    <TitleSection
      title="Personal Information"
      subtitle="This information will be displayed publicly so be careful what you
  share."
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-[80%]">
        <UserImage />

        <div className="grid grid-cols-2 gap-5">
          <CustomInput
            label="First name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            readOnly={isSubmitting}
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.firstName && values.firstName.length > 0
                ? errors.firstName
                : undefined
            }
          />
          <CustomInput
            label="Last name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            readOnly={isSubmitting}
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.lastName && values.lastName.length > 0
                ? errors.lastName
                : undefined
            }
          />
        </div>

        <CustomInput
          label="Email address"
          name="email"
          type="email"
          required
          readOnly
          value={user?.email}
          disabled
        />

        <div className="flex">
          <Button
            disabled={!isValid || isDisabled()}
            type="submit"
            className="w-fit mt-5 ml-auto"
          >
            Update
            <MoonLoader
              size={20}
              color="white"
              className="ml-2 text-white"
              loading={isSubmitting}
            />
          </Button>
        </div>
      </form>
    </TitleSection>
  );
};

const UserImage = () => {
  return (
    <div className="flex items-center gap-5">
      <Avatar className="h-[100px] w-[100px] p-0">
        <AvatarImage src="" alt="" />
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

      <div className="">
        <label
          htmlFor="image"
          className="bg-slate-100 dark:bg-neutral-800 rounded-lg px-2 py-2 hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
        >
          {" "}
          Change image
        </label>

        <p className="text-sm mt-3">JPG, GIF or PNG. 1MB max.</p>
      </div>
    </div>
  );
};
