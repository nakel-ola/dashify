import { ObjectId } from 'mongodb';
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

const formatValue = (value: string): number | string => {
  try {
    // Try converting the input value to a number
    const numberValue: number = parseFloat(value);
    // Check if the value is an integer, if so, convert it to an integer
    if (Number.isInteger(numberValue)) {
      return parseInt(value);
    } else {
      return numberValue;
    }
  } catch (error) {
    // If the input value cannot be converted to a number, return it as a string
    return value;
  }
};

const filter = (args: Filter) => {
  const { operator, value, name } = args;

  const newValue = name === '_id' ? new ObjectId(value) : formatValue(value);

  if (operator === '=') return { $eq: newValue };
  if (operator === '>') return { $gt: newValue };
  if (operator === '<') return { $lt: newValue };
  if (operator === '<>') return { $ne: newValue };
  if (operator === '<=') return { $lte: newValue };
  if (operator === '>=') return { $gte: newValue };
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

interface ObjectWithKeys {
  [key: string]: any;
}

export const convertArraysToObjects = (
  keys: string[],
  arrays: any[][],
): ObjectWithKeys[] => {
  const result: ObjectWithKeys[] = [];
  for (const arr of arrays) {
    const obj: ObjectWithKeys = {};
    for (let i = 0; i < keys.length; i++) {
      obj[keys[i]] = i < arr.length ? arr[i] : null;
    }
    result.push(obj);
  }
  return result;
};
