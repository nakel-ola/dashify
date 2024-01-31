type Where = {
  name: string;
  value: string;
};
export const formatDeleteWhere = (fields: Fields[], data: any[]): Where[] => {
  const pickableFields = fields.filter(
    (field) => field.isUnique || field.isIdentify
  );

  const fieldName =
    pickableFields.length === 0 ? fields[0].name : pickableFields[0].name;

  return generateWhere(fieldName, data);
};

const generateWhere = (key: string, data: any[]): Where[] => {
  const results: Where[] = [];
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];

    results.push({
      name: key,
      value: obj[key],
    });
  }

  return results;
};
