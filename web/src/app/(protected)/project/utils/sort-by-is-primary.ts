export const sortByIsPrimary = (arr: any[]) => {
  // Separate the array into two groups: primary and non-primary
  const primary = arr.filter((obj) => obj.isPrimary);
  const nonPrimary = arr.filter((obj) => !obj.isPrimary);

  // Concatenate the primary and non-primary groups
  const sortedArray = primary.concat(nonPrimary);

  return sortedArray;
};
