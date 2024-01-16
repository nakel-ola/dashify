import CustomInput from "@/components/custom-input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useFormik } from "formik";
import { ColumnSchema, ColumnType } from "../../create/schema";
import { useProjectStore } from "../../../store/project-store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { mySqlDataTypes, postgresqlDatatypes } from "../../../data/datatypes";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { MoonLoader } from "react-spinners";
import { useAddColumnStore } from "../../../store/add-column-store";
import { useQueries } from "../../../hooks/use-queries";
import { formatColumns } from "../../edit/[name]/utils/format-columns";
import { v4 } from "uuid";
import { toast } from "sonner";
import { editCollection } from "../../../services/edit-collection";

type Props = {};
export const AddColumnCard = (props: Props) => {
  const { isOpen, setIsOpen } = useAddColumnStore();

  const [{ pageName }] = useQueries();

  const project = useProjectStore((store) => store.project);

  const datatypes =
    project?.database === "mysql" ? mySqlDataTypes : postgresqlDatatypes;

  const queryClient = useQueryClient();

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
    setValues,
  } = useFormik<ColumnType>({
    initialValues: {
      name: "",
      dataType: "",
      defaultValue: null,
      isPrimary: false,
      isNullable: true,
      isArray: false,
      isIdentify: false,
      isUnique: false,
    },
    validationSchema: ColumnSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      if (!project) return;

      const projectId = project.projectId;

      const formattedColumn = formatColumns([{ ...values, id: v4() }], []);

      await editCollection({
        name: pageName,
        projectId,
        columns: formattedColumn,
      })
        .then(async () => {
          toast.success(`${values.name} added successfully`);
          await queryClient.invalidateQueries({
            queryKey: ["project", projectId],
          });
          handleClose();
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
  });

  const dataTypeItems = [
    ["int2", "int4", "int8"].includes(values.dataType)
      ? {
          key: "isIdentify",
          name: "Is Identify",
          description:
            "Automatically assign a sequential unique number to the column",
          checked: values.isIdentify,
        }
      : false,
    !values.isPrimary
      ? {
          key: "isArray",
          name: "Define as Array",
          description:
            "Allow column to be defined as variable-length multidimensional arrays",
          checked: values.isArray,
        }
      : null,
  ].filter(Boolean) as Item[];

  const constraints = [
    {
      key: "isPrimary",
      name: "Is Primary Key",
      description:
        "A primary key indicates that a column or group of columns can be used as a unique identifier for rows in the table",
      checked: values.isPrimary,
    },
    {
      key: "isNullable",
      name: "Allow Nullable",
      description:
        "Allow the column to assume a NULL value if no value is provided",
      checked: values.isNullable,
    },
    {
      key: "isUnique",
      name: "Is Unique",
      description:
        "Enforce if values in the column should be unique across rows",
      checked: values.isUnique,
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => handleClose()}>
      <SheetContent className="sm:!w-[700px] sm:max-w-md !p-0">
        <SheetHeader className="p-6 border-b-[1.5px] border-slate-100 dark:border-neutral-800">
          <SheetTitle>
            Add new column to
            <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2.5 py-1.5 mx-2">
              {pageName}
            </span>
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="h-full">
          <div className="h-[calc(100%-140px)] overflow-y-scroll py-6">
            {/* Name */}
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
              classes={{ root: "px-6" }}
              // showErrorMessage={false}
            />

            <Separator className="my-8" />

            {/* Data Type */}

            <div className="mt-6 px-6">
              <label
                htmlFor="type"
                className="block text-base font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5 pb-1"
              >
                Data Type
              </label>
              <Select
                value={values.dataType}
                onValueChange={(value) => setFieldValue("dataType", value)}
              >
                <SelectTrigger className="w-full !h-[38px]">
                  <SelectValue defaultValue="" placeholder="---" className="" />
                </SelectTrigger>

                <SelectContent className="max-h-52 overflow-y-scroll">
                  {datatypes.map((name, index) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="py-2 space-y-5 pt-5 px-6">
              {dataTypeItems.map(
                ({ name, description, checked, key }, index) => (
                  <div key={index} className="flex ">
                    <Checkbox
                      id={"data-type-ption-" + index}
                      className="w-[20px] h-[20px] rounded-md mt-1"
                      checked={checked}
                      onCheckedChange={() => setFieldValue(key, !checked)}
                    />

                    <label
                      htmlFor={"data-type-option-" + index}
                      className="ml-2"
                    >
                      <p className="text-base text-black dark:text-white">
                        {name}
                      </p>
                      <p className="text-sm text-gray-dark dark:text-gray-light">
                        {description}
                      </p>
                    </label>
                  </div>
                )
              )}
            </div>

            <CustomInput
              label="Default Value"
              name="defaultValue"
              type="string"
              required={!!values.isIdentify}
              readOnly={values.isIdentify || isSubmitting}
              disabled={values.isIdentify}
              value={values.defaultValue === null ? "" : values.defaultValue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors.name && values.name.length > 0 ? errors.name : undefined
              }
              classes={{ root: "mt-6 px-6" }}
              // showErrorMessage={false}
            />

            <Separator className="my-8" />

            {/* Constraints */}

            <div className="mt-6 px-6">
              <label
                htmlFor="type"
                className="block text-base font-semibold leading-6 text-gray-dark dark:text-gray-light pl-0.5 pb-1"
              >
                Constraints
              </label>

              <div className="py-2 space-y-5 px-2">
                {constraints.map(
                  ({ name, description, checked, key }, index) => (
                    <div key={index} className="flex ">
                      <Switch
                        id={"data-type-ption-" + index}
                        className="mt-1"
                        checked={checked}
                        onCheckedChange={() => setFieldValue(key, !checked)}
                      />

                      <label
                        htmlFor={"data-type-option-" + index}
                        className="ml-5"
                      >
                        <p className="text-base text-black dark:text-white">
                          {name}
                        </p>
                        <p className="text-sm text-gray-dark dark:text-gray-light">
                          {description}
                        </p>
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="p-6 py-3 border-t-[1.5px] border-slate-100 dark:border-neutral-800 space-x-6 flex">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-slate-200 dark:border-neutral-800 text-gray-dark dark:text-gray-light hover:bg-slate-100 hover:dark:bg-neutral-800 ml-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className=""
            >
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
      </SheetContent>
    </Sheet>
  );
};

type Item = {
  key: "isArray" | "isIdentify" | "isNullable" | "isUnique";
  name: string;
  description: string;
  checked: boolean;
};