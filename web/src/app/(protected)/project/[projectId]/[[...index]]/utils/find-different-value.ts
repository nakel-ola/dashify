export const findDifferentValue = (arr1: string[], arr2: string[]) => {
  const notFoundValues = [];
  for (let i = 0; i < arr2.length; i++) {
    if (!arr1.includes(arr2[i])) {
      notFoundValues.push(arr2[i]);
    }
  }
  return notFoundValues;
};
