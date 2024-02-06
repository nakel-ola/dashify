export const arraysContainSameContent = (arr1: string[], arr2: string[]) => {
  // If lengths are different, arrays cannot contain the same content
  if (arr1.length !== arr2.length) return false;

  // Sort both arrays
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Compare each element
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) return false;
  }

  return true;
};
