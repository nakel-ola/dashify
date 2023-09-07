import { Client } from 'pg';
import { Collection, Fields } from '../projects/types/collection.type';

type Args = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
};

type TableInfo = {
  schema: string;
  table_name: string;
};

type ColumnInfo = {
  column_name: string;
  data_type: string;
};

export const getPostgresTables = async (args: Args): Promise<Collection[]> => {
  const { host, port, name, username, password } = args;

  const client = new Client({
    user: username,
    host,
    database: name,
    password,
    port,
    ssl: true,
  });

  try {
    await client.connect();

    const results: Collection[] = [];

    const tableQuery = `
      SELECT table_schema AS schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema')
    `;

    const tableResult = await client.query<TableInfo>(tableQuery);

    // console.log(tableResult);

    for (const tableInfo of tableResult.rows) {
      const schema = tableInfo.schema;
      const tableName = tableInfo.table_name;

      const columnQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
      `;
      const columnResult = await client.query<ColumnInfo>(columnQuery, [
        schema,
        tableName,
      ]);

      const fields: Fields[] = [];

      for (const columnInfo of columnResult.rows) {
        const dataType = columnInfo.data_type;

        fields.push({
          name: columnInfo.column_name,
          type: getDataTypeGroup(dataType),
        });
      }

      results.push({ name: tableName, icon: 'Settings', fields });
    }

    return results;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
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
