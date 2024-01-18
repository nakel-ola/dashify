type ArrayType = {
  id: string;
  name: string;
  dataType: string;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  isArray: boolean;
  isIdentify: boolean;
  defaultValue?: string | null;
  references?: Partial<Reference> | null;
};

type AddColumn = {
  name: string;
  dataType: string;
  defaultValue?: string | null;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  isIdentify: boolean;
  isArray: boolean;
  type: "add";
  references?: Reference | null;
};

type DropColumn = {
  name: string;
  type: "drop";
};

type ResultType = (AddColumn | ModifyType | DropColumn)[];

export const formatColumns = (
  changedArray: ArrayType[],
  oldArray: ArrayType[]
): ResultType => {
  const results: ResultType = [];

  for (let i = 0; i < changedArray.length; i++) {
    const column = changedArray[i];

    const oldColumn = oldArray.find((a) => a.id === column.id);

    if (!oldColumn) {
      results.push({
        name: column.name,
        dataType: column.dataType,
        isPrimary: column.isPrimary,
        isNullable: column.isNullable,
        isUnique: column.isUnique,
        isArray: column.isArray,
        isIdentify: column.isIdentify,
        defaultValue: column.defaultValue,
        // TODO: Work on the foreign keys
        references: column.references as Reference,
        type: "add",
      });
    } else {
      const modifyColumn = formatModify(column, oldColumn);

      results.push(modifyColumn);
    }
  }

  return results;
};

type ModifyType = {
  operations: (
    | "Rename"
    | "Type"
    | "Add Default"
    | "Remove Default"
    | "Add Not null"
    | "Remove Not null"
    | "Add Foreign key"
    | "Remove Foreign key"
    | "Update Foreign key"
    | "FOREIGN"
  )[];
  name: string;
  type: "modify";
  newName?: string;
  dataType?: string;
  defaultValue?: string | null;
  references?: Reference | null;
};

type Reference = {
  fieldName: string;
  collectionName: string;
  onUpdate: "Cascade" | "Restrict" | null;
  onDelete: "Cascade" | "Restrict" | "Set default" | "Set NULL" | null;
};

const formatModify = (obj1: ArrayType, obj2: ArrayType): ModifyType => {
  let result: ModifyType = {
    operations: [],
    name: obj2.name,
    type: "modify",
  };

  const updateResult = (value: Omit<ModifyType, "name" | "type">) => {
    result = { ...result, ...value };
  };

  if (obj1.name !== obj2.name) {
    updateResult({
      operations: [...result.operations, "Rename"],
      newName: obj1.name,
    });
  }

  if (obj1.dataType !== obj2.dataType) {
    updateResult({
      operations: [...result.operations, "Type"],
      dataType: obj1.dataType,
    });
  }

  if (!obj1.defaultValue) {
    updateResult({
      operations: [...result.operations, "Remove Default"],
      defaultValue: obj1.defaultValue,
    });
  }

  if (obj1.defaultValue && obj1.defaultValue !== obj2.defaultValue) {
    updateResult({
      operations: [...result.operations, "Add Default"],
      defaultValue: obj1.defaultValue,
    });
  }

  if (!obj1.isNullable && obj1.isNullable !== obj2.isNullable) {
    updateResult({ operations: [...result.operations, "Add Not null"] });
  }

  if (obj1.isNullable && obj1.isNullable !== obj2.isNullable) {
    updateResult({ operations: [...result.operations, "Remove Not null"] });
  }

  if (obj1.references && !obj2.references) {
    updateResult({
      operations: [...result.operations, "Add Foreign key"],
      references: obj1.references as Reference,
    });
  }

  if (!obj1.references && obj2.references) {
    updateResult({
      operations: [...result.operations, "Remove Foreign key"],
      references: obj2.references as Reference,
    });
  }

  return result;
};
