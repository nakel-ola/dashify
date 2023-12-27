interface ObjectWithProperties {
  [key: string]: any;
}

export const arrangeValues = (
  objectArray: ObjectWithProperties[],
  stringArray: string[]
) => {
  const resultArray: ObjectWithProperties[] = [];

  objectArray.forEach((obj) => {
    const arrangedObject: ObjectWithProperties = {};

    stringArray.forEach((val) => {
      arrangedObject[val] = obj[val];
    });
    resultArray.push(arrangedObject);
  });

  return resultArray;
};