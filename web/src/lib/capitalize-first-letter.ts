export function capitalizeFirstLetter(input: string): string {
  if (input.length === 0) return input;

  const firstLetter = input.charAt(0).toUpperCase();
  const restOfTheString = input.slice(1);

  return firstLetter + restOfTheString;
}