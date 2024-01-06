"use client";

import { useCollectionModalStore } from "../store/collection-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProjectStore } from "../store/project-store";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/custom-input";
import { Button } from "@/components/ui/button";
import { MoonLoader } from "react-spinners";
import { ColumnsCard } from "./columns-card";

const Schema = Yup.object().shape({
  name: Yup.string().required(),
  columns: Yup.array(
    Yup.object().shape({
      name: Yup.string().required(),
      dataType: Yup.string().required(),
      defaultValue: Yup.string(),
      isPrimary: Yup.boolean().required().default(false),
      isNullable: Yup.boolean().required().default(false),
      isUnique: Yup.boolean().required().default(false),
      isIdentify: Yup.boolean().required().default(false),
      isArray: Yup.boolean().required().default(false),
    })
  )
    .required()
    .default([]),
});

export type SchemaType = Yup.InferType<typeof Schema>;
export type ColumnType = Yup.InferType<typeof Schema>["columns"][number];

type Props = {};
export const CreateCollection = (props: Props) => {
  const { isOpen, setIsOpen } = useCollectionModalStore();
  const project = useProjectStore((store) => store.project);

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
      columns: [
        {
          name: "id",
          dataType: "int8",
          isPrimary: true,
          isNullable: true,
          isArray: false,
          isIdentify: false,
          isUnique: false,
        },
      ],
    },
    validationSchema: Schema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: (values) => {},
  });

  const handleClick = (value: boolean) => {
    if (!value && !isSubmitting) {
      resetForm();
      // setActive(0);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

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
        isPrimary: false,
        defaultValue: "",
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
    <Dialog open={isOpen} onOpenChange={handleClick}>
      <DialogContent className="!max-w-[95%] lg:!max-w-[625px] !w-[95%] lg:!w-full max-h-[90%] overflow-y-scroll p-4 lg:p-6">
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            {project?.database === "mongodb" ? "collection" : "table"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details. Click Save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

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

          {project?.database !== "mongodb" ? (
            <ColumnsCard
              columns={values.columns}
              removeColumn={removeColumn}
              addColumn={addColumn}
              updateColumn={updateColumn}
            />
          ) : null}

          <div className="flex ">
            <Button type="submit" className="ml-auto">
              Save
              <MoonLoader
                size={20}
                color="white"
                className="ml-2 text-white"
                loading={isSubmitting}
              />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
