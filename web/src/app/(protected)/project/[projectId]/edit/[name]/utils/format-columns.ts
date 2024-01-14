export const formatColumns = (changedArray: Fields[], oldArray: Fields[]) => {
  const results = [];
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
        // references: column.references,
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
    | "FOREIGN"
  )[];
  name: string;
  type: "modify";
  newName?: string;
  dataType?: string;
  defaultValue?: string | null;
  references?: Reference;
};

type Reference = {
  fieldName: string;
  collectionName: string;
  onUpdate: string | null;
  onDelete: string | null;
};

const formatModify = (obj1: Fields, obj2: Fields): ModifyType => {
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

  return result;
};
