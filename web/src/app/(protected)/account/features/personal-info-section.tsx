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
import { ChangeEvent, Fragment, useState } from "react";
import { toBase64 } from "@/lib/to-base64";

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
      })

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

type UserImageProps = {
  onChange: (value: File) => void;
  value: any;
};

const UserImage = (props: UserImageProps) => {
  const { onChange, value } = props;
  const [url, setUrl] = useState<string | null>(null);

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = e.target.files;
      onChange(fileList[0]);
      const newUrl = await toBase64(fileList[0]);
      setUrl(newUrl.toString());
    }
  };
  return (
    <Fragment>
      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={(e) => onAvatarChange?.(e)}
      />
      <div className="flex items-center gap-5">
        <Avatar className="h-[100px] w-[100px] p-0">
          <AvatarImage
            src={url ?? value}
            alt=""
            className="h-full w-full !object-cover"
          />
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
    </Fragment>
  );
};
