export function deepCompare(a: any, b: any): boolean {
  const stringifiedA = JSON.stringify(a);
  const stringifiedB = JSON.stringify(b);
  return stringifiedA === stringifiedB;
}
