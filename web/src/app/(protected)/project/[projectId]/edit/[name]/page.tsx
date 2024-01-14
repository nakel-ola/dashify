"use client";

import { useFormik } from "formik";
import { useProjectStore } from "../../../store/project-store";
import { Schema, SchemaType } from "../../create/schema";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { useEffectOnce } from "usehooks-ts";
import { editCollection } from "../../../services/edit-collection";
import { clean } from "@/utils/clean";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  params: { name: string };
};

export default function ProjectEdit(props: Props) {
  const {
    params: { name },
  } = props;
  const project = useProjectStore((store) => store.project);
  const fields = useProjectStore((store) => store.getFields(name, false));

  const queryClient = useQueryClient();

  const router = useRouter();

  const isMongodb = project?.database === "mongodb";

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
  } = useFormik<SchemaType>({
    initialValues: {
      name: "",
      columns: [],
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (!project) return;

      const projectId = project.projectId;

      const args = clean({
        projectId,
        name,
        newName: values.name !== name ? values.name : null,
      });

      await editCollection(args)
        .then(async () => {
          toast.success(
            `${isMongodb ? "Collection" : "Table"} updated successfully`
          );

          await queryClient.invalidateQueries({
            queryKey: ["project", projectId],
          });

          router.push(`/project/${projectId}`);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    },
  });

  const isDisabled = () => {
    if (values.name !== name) return false;

    if (isSubmitting) return true;

    return true;
  };

  useEffectOnce(() => {
    setFieldValue("name", name);
  });

  return (
    <div className="flex justify-center py-10">
      <div className="w-[90%] lg:w-[65%] ">
        <h2 className="text-4xl font-semibold leading-none tracking-tight flex items-center">
          Update {isMongodb ? "collection" : "table"}{" "}
          <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2 py-1 ml-1 text-sm h-fit">
            {name}
          </span>
        </h2>

        <p className="text-base text-gray-dark dark:text-gray-light pt-2">
          Fill in the details. Click Update {isMongodb ? "collection" : "table"}{" "}
          when you&apos;re done.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 w-full">
          <CustomInput
            label="Name"
            name="name"
            type="string"
            required
            readOnly={isSubmitting}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              errors.name && values.name.length > 0 ? errors.name : undefined
            }
            showErrorMessage={false}
          />

          <div className="flex">
            <Button
              type="submit"
              disabled={!isValid || isDisabled()}
              className="ml-auto"
            >
              Update {isMongodb ? "collection" : "table"}
              <MoonLoader
                size={20}
                color="white"
                className="ml-2 text-white"
                loading={isSubmitting}
              />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
