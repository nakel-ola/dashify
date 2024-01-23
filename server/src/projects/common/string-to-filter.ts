export type Filter = {
  name: string;
  operator: SymbolType;
  value: string;
};

type Operator = {
  symbol: SymbolType;
  name: Name;
};

type Name = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';
type SymbolType = '=' | '<>' | '>' | '<' | '>=' | '<=';

export const operators: Operator[] = [
  {
    symbol: '=',
    name: 'eq',
  },
  {
    symbol: '<>',
    name: 'neq',
  },
  {
    symbol: '>',
    name: 'gt',
  },
  {
    symbol: '<',
    name: 'lt',
  },
  {
    symbol: '>=',
    name: 'gte',
  },
  {
    symbol: '<=',
    name: 'lte',
  },
];

export const stringToFilter = (str: string) => {
  const value = str.replaceAll('%2C', ',').replaceAll('%3A', ':');

  const results: Filter[] = [];

  const items = value.split(',');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const arr = item.split(':');

    const operator = operators.find((operator) => operator.name === arr[1]);

    if (operator) {
      results.push({
        name: arr[0],
        value: arr[2],
        operator: operator.symbol,
      });
    }
  }

  return results;
};
