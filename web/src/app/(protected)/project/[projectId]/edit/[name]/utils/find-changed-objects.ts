export const findChangedObjects = <T extends { id: string }>(
  oldArray: T[],
  newArray: T[]
) => {
  const changedObjects = [];

  for (const newObj of newArray) {
    const matchingOldObj = oldArray.find((oldObj) => oldObj.id === newObj.id);
    if (!matchingOldObj || !objectsAreEqual(matchingOldObj, newObj)) {
      changedObjects.push(newObj);
    }
  }

  return changedObjects;
};

const objectsAreEqual = (obj1: any, obj2: any) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
};
