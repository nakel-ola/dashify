import SqlString from 'sqlstring';
import { Sort } from './string-to-sort';

export const selectOrderBy = (args: Sort[]) => {
  const results: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    results.push(`${arg.name} ${SqlString.escape(arg.value)}`);
  }

  return `ORDER BY ${results.join(' , ')}`;
};
