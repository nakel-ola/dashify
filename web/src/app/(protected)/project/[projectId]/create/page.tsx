"use client";

import CustomInput from "@/components/custom-input";
import { useProjectStore } from "../../store/project-store";
import { useFormik } from "formik";
import { ColumnsCard } from "./features/columns-card";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { type ColumnType, Schema, type SchemaType } from "./schema";
import { ForeignSheet } from "./features/foreign-sheet";
import { createCollection } from "../../services/create-collection";
import { useToast } from "@/components/ui/use-toast";
import { useRefetchCollections } from "../../hooks/use-refetch-collections";
import { useRouter } from "next/navigation";

const mySqlColumnsDefault = [
  {
    name: "id",
    dataType: "int",
    isPrimary: true,
    isNullable: false,
    defaultValue: null,
    isArray: false,
    isIdentify: true,
    isUnique: false,
  },
  {
    name: "created_at",
    dataType: "timestamp",
    defaultValue: "now()",
    isPrimary: false,
    isNullable: false,
    isArray: false,
    isIdentify: false,
    isUnique: false,
  },
];

const postgresqlColumnsDefault = [
  {
    name: "id",
    dataType: "int8",
    isPrimary: true,
    isNullable: false,
    defaultValue: null,
    isArray: false,
    isIdentify: true,
    isUnique: false,
  },
  {
    name: "created_at",
    dataType: "timestamptz",
    defaultValue: "now()",
    isPrimary: false,
    isNullable: false,
    isArray: false,
    isIdentify: false,
    isUnique: false,
  },
];

export default function Create() {
  const project = useProjectStore((store) => store.project);

  const { toast } = useToast();

  const { refetch } = useRefetchCollections();

  const router = useRouter();

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
    setSubmitting,
  } = useFormik<SchemaType>({
    initialValues: {
      name: "",
      columns:
        project?.database === "mysql"
          ? mySqlColumnsDefault
          : postgresqlColumnsDefault,
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (!project) return;

      const projectId = project.projectId;

      await createCollection({ projectId, ...values })
        .then(async (results) => {
          toast({
            variant: "default",
            title: `${
              project.database === "mongodb" ? "Collection" : "Table"
            } created successfully`,
          });

          await refetch();

          router.push(`/project/${projectId}/${values.name}`);
        })
        .catch((err) => {
          console.log(err);
          toast({ variant: "destructive", title: err.message });
        });
    },
  });

  const removeColumn = (index: number) => {
    let items = [...values.columns];

    items.splice(index, 1);

    setFieldValue("columns", items);
  };

  const addColumn = () => {
    setFieldValue("columns", [
      ...values.columns,
      {
        name: "",
        dataType: "",
        defaultValue: null,
        isPrimary: false,
        isNullable: true,
        isArray: false,
        isIdentify: false,
        isUnique: false,
      },
    ]);
  };

  const updateColumn = <T extends keyof ColumnType>(
    index: number,
    key: T,
    value: ColumnType[T]
  ) => {
    let items = [...values.columns];

    items[index][key] = value;

    setFieldValue("columns", items);
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-[90%] lg:w-[65%] ">
        <h2 className="text-4xl font-semibold leading-none tracking-tight">
          Create a new{" "}
          {project?.database === "mongodb" ? "collection" : "table"}
        </h2>

        <p className="text-base text-gray-dark dark:text-gray-light pt-2">
          Fill in the details. Click Save when you&apos;re done.
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

          <ColumnsCard
            columns={values.columns}
            removeColumn={removeColumn}
            addColumn={addColumn}
            updateColumn={updateColumn}
            database={project?.database!}
          />

          <div className="flex">
            <Button
              type="submit"
              // onClick={() => handleSubmit()}
              className="ml-auto"
            >
              Create {project?.database === "mongodb" ? "collection" : "table"}
              <MoonLoader
                size={20}
                color="white"
                className="ml-2 text-white"
                loading={isSubmitting}
              />
            </Button>
          </div>
        </form>

        <ForeignSheet updateColumn={updateColumn} />
      </div>
    </div>
  );
}
