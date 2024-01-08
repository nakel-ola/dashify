import * as Yup from "yup";

export const Schema = Yup.object().shape({
  name: Yup.string().required(),
  columns: Yup.array(
    Yup.object().shape({
      name: Yup.string().required(),
      dataType: Yup.string().required(),
      defaultValue: Yup.string().nullable(),
      isPrimary: Yup.boolean().required().default(false),
      isNullable: Yup.boolean().required().default(false),
      isUnique: Yup.boolean().required().default(false),
      isIdentify: Yup.boolean().required().default(false),
      isArray: Yup.boolean().required().default(false),
      references: Yup.object()
        .shape({
          collectionName: Yup.string(),
          fieldName: Yup.string(),
          onUpdate: Yup.string()
            .oneOf(["Cascade", "Restrict"] as const)
            .nullable(),
          onDelete: Yup.string()
            .oneOf(["Cascade", "Restrict", "Set default", "Set NULL"] as const)
            .nullable(),
        })
        .notRequired(),
    })
  )
    .required()
    .default([]),
});

export type SchemaType = Yup.InferType<typeof Schema>;
export type ColumnType = Yup.InferType<typeof Schema>["columns"][number];
