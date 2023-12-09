"use client";

import { TitleSection } from "./title-section";
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
import { UserImage } from "./user-image";

const Schema = Yup.object().shape({
  firstName: Yup.string().min(3).max(50).required("First Name is required"),
  lastName: Yup.string().min(3).max(50).required("Last Name is required"),
  image: Yup.mixed()
    .test("file", "Please upload a file", (value) => {
      if (!value) return false;

      const isFile = value instanceof File;

      if (!isFile) return true;

      return true;
    })
    .nullable(),
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
      image: null,
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      const args = clean({
        firstName:
          values.firstName !== user?.firstName ? values.firstName : null,
        lastName: values.lastName !== user?.lastName ? values.lastName : null,
        image: values.image !== user?.photoUrl ? values.image : null,
      });

      await updateUser({ ...args })
        .then(async (result) => {
          await update({
            ...data,
            user: { ...user, ...args, photoUrl: result.photoUrl },
          });
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
    if (values.image !== user?.photoUrl) return false;

    if (isSubmitting) return true;

    return true;
  };

  useEffectOnce(() => {
    setFieldValue("firstName", user?.firstName);
    setFieldValue("lastName", user?.lastName);
    setFieldValue("image", user?.photoUrl);
  });

  return (
    <TitleSection
      title="Personal Information"
      subtitle="This information will be displayed publicly so be careful what you
  share."
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-[80%]">
        <UserImage
          value={user?.photoUrl}
          onChange={(file) => setFieldValue("image", file)}
        />

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
