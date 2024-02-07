type Where = {
  name: string;
  value: string;
};
export const formatDeleteWhere = (fields: Fields[], items: any[]): Where[] => {
  const results: Where[] = [];
  const pickableFields = fields.filter(
    (field) => field.isUnique || field.isIdentify
  );
  const fieldName =
    pickableFields.length === 0 ? fields[0].name : pickableFields[0].name;

  items.forEach((item) => {
    for (const propName in item) {
      if (
        item[propName] === null ||
        item[propName] === undefined ||
        item[propName] === ""
      ) {
        delete item[propName];
      }
    }
    const validField = Object.keys(item)[0] || fieldName;
    results.push({
      name: validField,
      value: item[validField],
    });
  });

  return results;
};
