export const findDeletedObjects = (
  oldArray: any[],
  newArray: any[]
) => {
  const results = oldArray.filter(
    (oldObj) => !newArray.some((newObj) => newObj.id === oldObj.id)
  );

  return results.map((result) => ({
    name: result.name,
    type: "drop",
  }));
};
