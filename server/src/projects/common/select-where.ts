import { Filter } from './string-to-filter';
import * as SqlString from './query-generatore/sqlstring';

export const selectWhere = (args: Filter[]) => {
  const results: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    results.push(`${arg.name} ${arg.operator} ${SqlString.escape(arg.value)}`);
  }

  return `WHERE ${results.join(' AND ')}`;
};
