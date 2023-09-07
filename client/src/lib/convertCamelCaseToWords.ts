export function convertCamelCaseToWords(input: string): string {
  const words = input.replace(/([a-z])([A-Z])/g, "$1 $2");
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}
