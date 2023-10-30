export const isObjectValueEmpty = (object: Record<string, any>) => {
  for (const key in object) {
    if (object[key] !== undefined) return false;
  }

  return true;
};
