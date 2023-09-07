import * as mysql from 'mysql2/promise';
import { Collection } from '../projects/types/collection.type';

interface Args {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export const getMysqlTables = async (args: Args): Promise<Collection[]> => {
  const { host, port, name, username, password } = args;

  // Create a MySQL connection
  const connection = await mysql.createConnection({
    host,
    user: username,
    password,
    database: name,
    port,
  });

  try {
    const [rows]: any[] = await connection.query(
      `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ?`,
      [name],
    );

    connection.end();

    const tableSchemas: Collection[] = [];
    rows.forEach((row: any) => {
      const existingSchema = tableSchemas.find(
        (schema) => schema.name === row.TABLE_NAME,
      );
      if (existingSchema) {
        existingSchema.fields.push({
          name: row.COLUMN_NAME,
          ...categorizeMySQLDataType(row.DATA_TYPE, row.COLUMN_TYPE),
        });
      } else {
        tableSchemas.push({
          name: row.TABLE_NAME,
          icon: 'Settings',
          fields: [
            {
              name: row.COLUMN_NAME,
              ...categorizeMySQLDataType(row.DATA_TYPE, row.COLUMN_TYPE),
            },
          ],
        });
      }
    });

    return tableSchemas;
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
};

function categorizeMySQLDataType(dataType: string, columnType: string) {
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
