"use client";

import { TitleSection } from "@/app/(protected)/account/features/title-section";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProjectStore } from "../../../store/project-store";
import { useCopyToClipboard } from "usehooks-ts";
import { UserImage } from "@/app/(protected)/account/features";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { clean } from "@/utils/clean";
import { updateProject } from "../services/update-project";
import { toast } from "sonner";
import { Copy } from "iconsax-react";
import { CheckIcon } from "lucide-react";

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
  const { project, setProject } = useProjectStore();

  const [copyValue, setCopyValue] = useCopyToClipboard();

  const [copied, setCopied] = useState(false);

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
    onSubmit: async (values) => {
      if (!project) return;

      const args = clean({
        name: values.name !== project?.name ? values.name : null,
        logo: values.image !== project?.logo ? values.image : null,
      });

      await updateProject({ ...args, projectId: project?.projectId })
        .then(async (result) => {
          setProject({ ...project, ...args });
          toast.success("Details updated successfully");
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
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

  const handleCopy = () => {
    if (!project) return;

    setCopyValue(project?.projectId).then(() => {
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <TitleSection
      title="Information"
      subtitle="This information will be displayed to you or members of the project"
      classes={{ left: { root: "lg:w-[50%]" } }}
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full lg:w-[100%]">
        <UserImage
          value={project?.logo}
          onChange={(file) => setFieldValue("image", file)}
        />

        <CustomInput
          label="Project name"
          name="name"
          type="text"
          autoComplete="name"
          required
          readOnly={isSubmitting}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            errors.name &&
            values.name !== project?.name &&
            values.name.length > 0
              ? errors.name
              : undefined
          }
        />

        <CustomInput
          label="Reference ID"
          readOnly
          value={project?.projectId}
          disabled
          classes={{ inputIcon: "pr-1" }}
          endIcon={
            <button
              type="button"
              onClick={() => handleCopy()}
              className="flex items-center bg-slate-100 dark:bg-neutral-800 px-2 py-1 rounded-md gap-1"
            >
              {copied ? <CheckIcon size={20} /> : <Copy size={20} />}
              {copied ? "Copied" : "Copy"}
            </button>
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
