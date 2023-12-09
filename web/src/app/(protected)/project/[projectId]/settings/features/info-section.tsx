"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProjectStore } from "../../../store/project-store";
import { useEffectOnce } from "usehooks-ts";
import { UserImage } from "@/app/(protected)/account/features";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { useEffect } from "react";

const Schema = Yup.object().shape({
  name: Yup.string().min(3).max(50).required("First Name is required"),
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
export const InfoSection = (props: Props) => {
  const { project } = useProjectStore();
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
      name: "",
      image: null,
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {},
  });

  useEffect(() => {
    if (!project) return;

    setFieldValue("name", project?.name ?? "");
    setFieldValue("image", project?.logo ?? "");
  }, [project, setFieldValue]);

  const isDisabled = () => {
    if (values.name !== project?.name) return false;
    if (values.image !== project?.logo) return false;

    if (isSubmitting) return true;

    return true;
  };

  return (
    <TitleSection
      title="Information"
      subtitle="This information will be displayed to you or members of the project"
      classes={{ left: { root: "lg:w-[50%]" } }}
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-[80%]">
        <UserImage
          value={project?.logo}
          onChange={(file) => setFieldValue("image", file)}
        />

        <CustomInput
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          required
          readOnly={isSubmitting}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.name && values.name.length > 0 ? errors.name : undefined
          }
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
