export const getMongodbArrayType = (arr: any[]): any[] => {
  if (arr.length === 0) return [];

  const sampleValue = arr[0];
  let arrayType: any = typeof sampleValue;

  if (sampleValue === null) {
    arrayType = [];
  } else if (arrayType === 'object' && sampleValue instanceof Date) {
    arrayType = ['Date'];
  } else if (arrayType === 'object') {
    const objectType = getMongodbObjectFieldType(sampleValue);
    arrayType = objectType;
  }

  return arrayType;
};

export const getMongodbObjectFieldType = (obj: object) => {
  const fieldTypes = [];

  for (const key in obj) {
    if (key === '__v') continue;

    fieldTypes.push({
      name: key,
      type: key === '_id' ? 'string' : typeof obj[key],
    });
  }

  return fieldTypes;
};

export function getDataTypeGroup(dataType: string): string | null {
  const arrayTypes = [
    'int[]',
    'text[]',
    'varchar[]',
    'numeric[]',
    'json[]',
    'jsonb[]',
    'array',
  ];
  const stringTypes = [
    'char',
    'varchar',
    'text',
    'citext',
    'character varying',
    'character',
  ];
  const numberTypes = [
    'smallint',
    'integer',
    'bigint',
    'decimal',
    'numeric',
    'real',
    'double precision',
    'serial',
    'bigserial',
    'smallserial',
  ];
  const objectTypes = [
    'json',
    'jsonb',
    'hstore',
    'tsvector',
    'tsquery',
    'uuid',
    'point',
    'line',
    'lseg',
    'box',
    'path',
    'polygon',
    'circle',
  ];

  if (arrayTypes.includes(dataType.toLowerCase())) {
    return 'array';
  } else if (stringTypes.includes(dataType.toLowerCase())) {
    return 'string';
  } else if (numberTypes.includes(dataType.toLowerCase())) {
    return 'number';
  } else if (objectTypes.includes(dataType.toLowerCase())) {
    return 'object';
  } else {
    return dataType;
  }
}

export function categorizeMySQLDataType(dataType: string, columnType: string) {
  const stringTypes = ['char', 'varchar', 'text', 'blob'];
  const numberTypes = ['tinyint', 'smallint', 'int', 'bigint'];
  const enumTypes = ['enum', 'set'];
  const arrayTypes = ['json', 'array'];
  const objTypes = ['json'];
  const datetimeTypes = ['datetime'];

  if (stringTypes.some((type) => dataType.startsWith(type))) {
    return { type: 'string' };
  } else if (numberTypes.includes(dataType)) {
    return { type: 'number' };
  } else if (enumTypes.some((type) => dataType.startsWith(type))) {
    const enumValues =
      columnType
        .match(/\((.*?)\)/)?.[1]
        ?.replaceAll("'", '')
        ?.split(',') || [];

    return {
      type: 'enum',
      enumValues,
    };
  } else if (arrayTypes.includes(dataType)) {
    return { type: 'array' };
  } else if (objTypes.includes(dataType)) {
    return { type: 'object' };
  } else if (datetimeTypes.some((type) => dataType.startsWith(type))) {
    return { type: 'datetime' };
  } else {
    return { type: dataType };
  }
}
