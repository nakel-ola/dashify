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

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const validFields = cleanField(item);

    const itemEntries = Object.entries(validFields);

    if (itemEntries.length > 0) {
      results.push({
        name: itemEntries[0][0],
        value: itemEntries[0][1] as any,
      });
    } else {
      results.push({
        name: fieldName,
        value: item[fieldName],
      });
    }
  }

  return results;
};

const cleanField = <T = any>(obj: any): T => {
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
};
