import { Sort } from './string-to-sort';

export const selectOrderBy = (args: Sort[]) => {
  const results: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    results.push(`${arg.name} ${arg.value}`);
  }

  return `ORDER BY ${results.join(' , ')}`;
};
