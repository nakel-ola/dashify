import * as mysql from 'mysql2/promise';
import { Collection } from '../types/project.type';
import { categorizeMySQLDataType } from './utils';
import { MySqlQueryGenerator, type DataType } from './query-generatore/mysql';

interface ConnectionOption {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

type DuplicateTableArgs = {
  tableName: string;
  duplicateName: string;
  withData?: boolean;
};

type GetTableArgs = {
  tableName: string;
  offset: number;
  limit: number;
};

type EditTableArgs = {
  tableName: string;
  newTableName: string;
};

export class MySQLDatabase {
  private connection: mysql.Connection;

  constructor() {}

  async connect(connectionOption: ConnectionOption) {
    const { host, name, username, port, password } = connectionOption;
    try {
      this.connection = await mysql.createConnection({
        host,
        user: username,
        password,
        database: name,
        port,
      });
      await this.connection.connect();
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      throw error;
    }
  }

  public async createTable(
    tableName: string,
    columns: DataType[],
  ): Promise<void> {
    try {
      const queryGen = new MySqlQueryGenerator();

      const escapeTableName = mysql.escapeId(tableName);

      const tableQuery = queryGen.createTable(escapeTableName, columns);

      await this.connection.execute(tableQuery);
    } catch (error) {
      console.error(`Error creating table "${tableName}":`, error);
      throw error;
    }
  }

  public async getTables(name: string) {
    try {
      const [rows]: any[] = await this.connection.query(
        `
          SELECT COLUMN_DEFAULT, TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ?
        `,
        [name],
      );

      const tableSchemas: Collection[] = [];
      rows.forEach((row: any) => {
        const existingSchema = tableSchemas.find(
          (schema) => schema.name === row.TABLE_NAME,
        );

        const field = {
          name: row.COLUMN_NAME,
          ...categorizeMySQLDataType(row.DATA_TYPE, row.COLUMN_TYPE),
          dataType: row.DATA_TYPE,
          udtName: row.COLUMN_TYPE,
          defaultValue: row.COLUMN_DEFAULT,
        };
        if (existingSchema) {
          existingSchema.fields.push(field);
        } else {
          tableSchemas.push({
            name: row.TABLE_NAME,
            icon: 'Settings',
            fields: [field],
          });
        }
      });
      return tableSchemas;
    } catch (error) {
      console.error(`Error getting tables:`, error);
      throw error;
    }
  }

  public async getTable(args: GetTableArgs) {
    const { tableName, limit, offset } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);
      const escapeLimit = mysql.escape(parseInt(limit.toString()) || 10);
      const escapeOffset = mysql.escape(parseInt(offset.toString()) || 10);
      const query = `SELECT * FROM ${escapeTableName} LIMIT ${escapeLimit} OFFSET ${escapeOffset}`;
      const countQuery = `SELECT COUNT(*) AS totalCount FROM ${escapeTableName};`;
      const [rows] = await this.connection.execute(query);
      const data = await this.connection.query(countQuery);
      return { results: rows, totalItems: (data[0] as any).totalCount };
    } catch (error) {
      console.error(`Error getting table '${tableName}':`, error);
      throw error;
    }
  }

  public async editTable(args: EditTableArgs) {
    const { tableName, newTableName } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);
      const escapeNewTableName = mysql.escapeId(newTableName);
      const query = `RENAME TABLE ${escapeTableName} TO ${escapeNewTableName}`;
      await this.connection.execute(query);
    } catch (error) {
      console.error(`Error updating table '${tableName}':`, error);
      throw error;
    }
  }

  public async duplicateTable(args: DuplicateTableArgs): Promise<void> {
    const { tableName, duplicateName } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);
      const escapeNewTableName = mysql.escapeId(duplicateName);
      const duplicateTableQuery = `CREATE TABLE IF NOT EXISTS ${escapeNewTableName} AS SELECT * FROM ${escapeTableName}`;
      await this.connection.execute(duplicateTableQuery);
    } catch (error) {
      console.error(
        `Error duplicating table '${tableName}' to '${duplicateName}':`,
        error,
      );
      throw error;
    }
  }

  public async deleteTable(tableName: string): Promise<{ message: string }> {
    try {
      const escapeTableName = mysql.escapeId(tableName);

      const deleteTableQuery = `DROP TABLE IF EXISTS ${escapeTableName}`;
      await this.connection.execute(deleteTableQuery);

      return { message: 'Table delete successfully' };
    } catch (error) {
      console.error(`Error deleting table "${tableName}":`, error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      await this.connection.end();
      console.log('Connection to MySQL database closed');
    } catch (error) {
      console.error('Error closing connection to PostgreSQL database:', error);
    }
  }
}
