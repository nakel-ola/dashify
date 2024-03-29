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
  const timestampTypes = ['timestamp with time zone'];

  if (arrayTypes.includes(dataType.toLowerCase())) {
    return 'array';
  } else if (stringTypes.includes(dataType.toLowerCase())) {
    return 'string';
  } else if (numberTypes.includes(dataType.toLowerCase())) {
    return 'number';
  } else if (objectTypes.includes(dataType.toLowerCase())) {
    return 'object';
  } else if (timestampTypes.includes(dataType.toLowerCase())) {
    return 'timestampz';
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
  const timestampTypes = ['timestamp with time zone'];

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
  } else if (timestampTypes.some((type) => dataType.startsWith(type))) {
    return { type: 'timestampz' };
  } else {
    return { type: dataType };
  }
}

type DataType = {
  name: string;
  dataType:
    | 'int2'
    | 'int4'
    | 'int8'
    | 'float4'
    | 'float8'
    | 'numeric'
    | 'json'
    | 'jsonb'
    | 'text'
    | 'varchar'
    | 'uuid'
    | 'date'
    | 'time'
    | 'timetz'
    | 'timestamp'
    | 'timestamptz'
    | 'bool';
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  isArray: boolean;
  isIdentify: boolean;
  defaultValue?: string | null;
  references?: {
    onUpdate?: 'Cascade' | 'Restrict' | null;
    onDelete?: 'Cascade' | 'Restrict' | 'Set default' | 'Set NULL' | null;
    collectionName: string;
    fieldName: string;
  };
};

export const formatPostgresDataType = (items: DataType[]) => {
  let results: string[] = [];

  const primaries = items.filter((item) => item.isPrimary === true);
  const foreigns = items.filter((item) => item.references);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    let column = `${item.name} ${dataType[item.dataType]}`;

    if (item.isArray) column += '[]';

    if (item.isIdentify) column += ' GENERATED BY DEFAULT AS IDENTITY';

    if (item.isPrimary && primaries.length === 1) column += ' PRIMARY KEY';

    if (item.isUnique) column += ' UNIQUE';

    if (item.defaultValue !== null && item.defaultValue !== undefined)
      column += ` DEFAULT ${formatDefaultValue(item.defaultValue)}`;

    if (!item.isNullable) column += ' NOT NULL';

    results.push(column);
  }

  if (primaries.length > 1) {
    results.push(
      `PRIMARY KEY (${primaries.map((primary) => primary.name).join(', ')})`,
    );
  }

  if (foreigns.length > 0) {
    results = [...results, ...formatPostgresForeigns(foreigns)];
  }

  return results;
};

const formatPostgresForeigns = (items: DataType[]) => {
  const results: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const references = item.references;

    const constraintName = 'fk_' + references?.collectionName;
    let foreign = `CONSTRAINT ${constraintName}
      FOREIGN KEY (${item.name})
      REFERENCES ${references?.collectionName} (${item.references?.fieldName})
    `;

    if (references?.onUpdate) {
      foreign += `ON UPDATE ${references?.onUpdate.toUpperCase()}\n`;
    }
    if (references?.onDelete) {
      foreign += `    ON DELETE ${references?.onDelete.toUpperCase()}`;
    }

    results.push(foreign);
  }

  return results;
};

const formatDefaultValue = (value: string | null) => {
  if (value === 'now()') return 'CURRENT_TIME';
  if (value === "(now() at time zone 'utc)")
    return "(CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TIME";
  if (value === 'gen_random_uuid()') return 'gen_random_uuid()';

  if (value === '') return `""`;

  if (!isNaN(value as any)) return Number(value);

  return `"${value}"`;
};

const dataType: Record<DataType['dataType'], string> = {
  int2: 'SMALLINT',
  int4: 'INTEGER',
  int8: 'BIGINT',
  numeric: 'NUMERIC',
  float4: 'FLOAT4',
  float8: 'FLOAT8',
  json: 'JSON',
  jsonb: 'JSONB',
  text: 'TEXT',
  varchar: 'VARCHAR(255)',
  uuid: 'UUID',
  date: 'DATE',
  time: 'TIME',
  timetz: 'TIMETZ',
  timestamp: 'TIMESTAMP',
  timestamptz: 'TIMESTAMPTZ',
  bool: 'BOOL',
};

export const formatMySqlDataType = (items: DataType[]) => {
  let results: string[] = [];

  const primaries = items.filter((item) => item.isPrimary === true);
  const foreigns = items.filter((item) => item.references);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    let column = `${item.name} ${dataType[item.dataType]}`;

    if (item.isIdentify) column += ' AUTO_INCREMENT';

    if (item.isPrimary && primaries.length === 1) column += ' PRIMARY KEY';

    if (item.isUnique) column += ' UNIQUE';

    if (item.defaultValue !== null && item.defaultValue !== undefined)
      column += ` DEFAULT ${formatMySqlDefaultValue(item.defaultValue)}`;

    if (!item.isNullable) column += ' NOT NULL';

    results.push(column);
  }

  if (primaries.length > 1) {
    results.push(
      `PRIMARY KEY (${primaries.map((primary) => primary.name).join(', ')})`,
    );
  }

  if (foreigns.length > 0) {
    results = [...results, ...formatMySqlForeigns(foreigns)];
  }

  return results;
};

const formatMySqlForeigns = (items: DataType[]) => {
  const results: string[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const references = item.references;

    let foreign = `FOREIGN KEY (${item.name})
      REFERENCES ${references?.collectionName}(${item.references?.fieldName})
    `;

    if (references?.onUpdate) {
      foreign += `ON UPDATE ${references?.onUpdate.toUpperCase()}\n`;
    }
    if (references?.onDelete) {
      foreign += `    ON DELETE ${references?.onDelete.toUpperCase()}`;
    }

    results.push(foreign);
  }

  return results;
};

const formatMySqlDefaultValue = (value: string | null) => {
  if (value === 'now()') return 'CURRENT_TIME';
  if (value === "(now() at time zone 'utc)")
    return "(CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::TIME";
  if (value === 'gen_random_uuid()') return 'gen_random_uuid()';

  if (value === '') return `""`;

  if (!isNaN(value as any)) return Number(value);

  return `"${value}"`;
};

/*
 DATE - Date format (YYYY-MM-DD).
TIME - Time format (HH:MM:SS).
DATETIME - Date and time (YYYY-MM-DD HH:MM:SS).
TIMESTAMP - Timestamp, often used for automatic updates.
YEAR - Year in two-digit or four-digit format.
 */
