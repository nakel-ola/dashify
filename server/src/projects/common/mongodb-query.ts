import { Filter, stringToFilter } from './string-to-filter';
import { stringToSort } from './string-to-sort';

export const mongodbFilter = (str: string) => {
  const items = stringToFilter(str);

  const query = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (query[item.name]) {
      query[item.name] = {
        ...query[item.name],
        ...filter(item),
      };
    } else {
      query[item.name] = filter(item);
    }
  }

  return query;
};

const filter = (args: Filter) => {
  const { operator, value } = args;

  if (operator === '=') return { $eq: value };
  if (operator === '>') return { $gt: value };
  if (operator === '<') return { $lt: value };
  if (operator === '<>') return { $ne: value };
  if (operator === '<=') return { $lte: value };
  if (operator === '>=') return { $gte: value };
};

export const mongodbSort = (str: string) => {
  const items = stringToSort(str);

  const query = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    query[item.name] = item.value === 'ASC' ? 1 : -1;
  }

  return query;
};
