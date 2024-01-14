export const arraysOfObjectsAreEqual = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    const obj1 = arr1[i];
    const obj2 = arr2[i];

    // Assuming objects have the same properties
    const objKeys = Object.keys(obj1);

    for (const key of objKeys) {
      if (obj1[key] !== obj2[key]) return false;
    }
  }

  return true;
}
