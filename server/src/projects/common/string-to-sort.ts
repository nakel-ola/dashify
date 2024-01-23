export type Sort = {
  name: string;
  value: 'ASC' | 'DESC';
};

export const stringToSort = (str: string) => {
  const value = str.replaceAll('%2C', ',').replaceAll('%3A', ':');

  const results: Sort[] = [];

  const items = value.split(',');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const arr = item.split(':');

    if (arr.length === 2) {
      results.push({
        name: arr[0],
        value: arr[1].toUpperCase() as Sort['value'],
      });
    }
  }

  return results;
};
