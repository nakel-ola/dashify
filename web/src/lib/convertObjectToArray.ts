export function convertObjectToArray(obj: { [key: string]: any }): any[] {
  return Object.values(obj);
}
