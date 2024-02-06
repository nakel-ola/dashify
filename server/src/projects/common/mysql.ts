import * as mysql from 'mysql2/promise';
import { Collection } from '../types/project.type';
import { categorizeMySQLDataType } from './utils';
import {
  MySqlQueryGenerator,
  type DataType,
  AlterModifyType,
} from './query-generatore/mysql';
import { v4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

interface ConnectionOption {
  name: string;
  host: string;
  port: number;
  ssl: boolean;
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
  sort?: string;
  filter?: string;
};

type InsertRowArgs = {
  tableName: string;
  data: {
    name: string;
    value: string | number;
  }[];
};

type InsertRowsArgs = {
  tableName: string;
  fieldNames: string[];
  values: any[][];
};

type UpdateRowArgs = {
  tableName: string;
  set: {
    name: string;
    value: string;
  }[];
  where: {
    name: string;
    value: string;
  };
};

type DeleteRowArgs = {
  tableName: string;
  deleteAll?: boolean | string;
  where?: {
    name: string;
    value: string;
  }[];
};

type EditModifyTable = AlterModifyType & {
  type: 'modify';
};
type EditColumnTable = DataType & {
  type: 'add' | 'drop';
};

export type EditTableArgs = {
  tableName: string;
  newTableName?: string;
  columns?: (EditModifyTable | EditColumnTable)[];
};

type ColumnInfo = {
  COLUMN_DEFAULT: string;
  TABLE_NAME: string;
  COLUMN_NAME: string;
  DATA_TYPE: string;
  COLUMN_TYPE: string;
  COLUMN_KEY: string;
  IS_NULLABLE: string;
  EXTRA: string;
};

export class MySQLDatabase {
  private connection: mysql.Connection;

  private queryGen = new MySqlQueryGenerator();

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
        // ssl,
      });
      await this.connection.connect();
    } catch (error) {
      console.error('Error connecting to MySQL database:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createTable(
    tableName: string,
    columns: DataType[],
  ): Promise<void> {
    try {
      const escapeTableName = mysql.escapeId(tableName);

      const tableQuery = this.queryGen.createTable(escapeTableName, columns);

      await this.connection.execute(tableQuery);
    } catch (error) {
      console.error(`Error creating table "${tableName}":`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getTables(name: string) {
    try {
      const [result]: any[] = await this.connection.query(
        `
          SELECT COLUMN_DEFAULT, TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, COLUMN_KEY, IS_NULLABLE, EXTRA
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ?
        `,
        [name],
      );

      const rows = result as ColumnInfo[];

      const tableSchemas: Collection[] = [];
      rows.forEach((row) => {
        const existingSchema = tableSchemas.find(
          (schema) => schema.name === row.TABLE_NAME,
        );

        const field = {
          id: v4(),
          name: row.COLUMN_NAME,
          ...categorizeMySQLDataType(row.DATA_TYPE, row.COLUMN_TYPE),
          dataType: row.DATA_TYPE,
          udtName: row.COLUMN_TYPE,
          defaultValue: row.COLUMN_DEFAULT,
          isNullable: this.convertToBool(row.IS_NULLABLE),
          isIdentify: row.EXTRA.includes('DEFAULT_GENERATED'),
          isPrimary: false,
          isUnique: false,
          ...this.formatConstraint(row.COLUMN_KEY),
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
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getTable(args: GetTableArgs) {
    const { tableName, limit, offset, sort, filter } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);
      const escapeLimit = mysql.escape(parseInt(limit.toString()) || 10);
      const escapeOffset = mysql.escape(parseInt(offset.toString()) || 0);

      const query = this.queryGen.selectTable(escapeTableName, {
        limit: Number(escapeLimit),
        offset: Number(escapeOffset),
        sort,
        filter,
      });

      const countQuery = this.queryGen.countTable(escapeTableName, {
        filter,
      });

      const [rows] = await this.connection.execute(query);
      const data = await this.connection.query(countQuery);
      return { results: rows, totalItems: (data[0] as any).totalCount };
    } catch (error) {
      console.error(`Error getting table '${tableName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async insertRow(args: InsertRowArgs) {
    const { tableName, data } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);
      const query = this.queryGen.insertIntoTable(escapeTableName, data);

      await this.connection.query(query);

      return { message: 'Row inserted successfully' };
    } catch (error) {
      console.error(`Error creating row:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async insertRows(args: InsertRowsArgs) {
    const { tableName, fieldNames, values } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);
      const query = this.queryGen.insertRowsIntoTable(escapeTableName, {
        fieldNames,
        values,
      });

      await this.connection.query(query);

      return { message: 'Row inserted successfully' };
    } catch (error) {
      console.error(`Error creating row:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateRow(args: UpdateRowArgs) {
    const { tableName, set, where } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);

      const query = this.queryGen.updateTableRow(escapeTableName, {
        set,
        where,
      });

      await this.connection.query(query);

      return { message: 'Row updated successfully' };
    } catch (error) {
      console.error(`Error updating row:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteRows(args: DeleteRowArgs) {
    const { tableName, deleteAll, where = [] } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);

      const queries = [];

      if (deleteAll || typeof deleteAll === 'string') {
        const query = this.queryGen.deleteFromTable(escapeTableName, {
          deleteAll,
        });

        queries.push(query);
      } else {
        for (let i = 0; i < where.length; i++) {
          const query = this.queryGen.deleteFromTable(escapeTableName, {
            where: where[i],
          });

          queries.push(query);
        }
      }

      await this.runMultipleQueries(queries);

      return { message: 'Rows deleted successfully' };
    } catch (error) {
      console.error(`Error deleting row:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async editTable(args: EditTableArgs) {
    const { tableName, newTableName, columns = [] } = args;

    try {
      const escapeTableName = mysql.escapeId(tableName);

      let queries: string[] = [];

      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        if (column.type === 'modify') {
          queries = [
            ...queries,
            ...this.queryGen.alterModify(escapeTableName, column),
          ];
        } else {
          queries.push(
            this.queryGen.alterTable(escapeTableName, column.type, column),
          );
        }
      }

      if (newTableName) {
        const escapeNewTableName = mysql.escapeId(newTableName);

        queries.push(
          `RENAME TABLE ${escapeTableName} TO ${escapeNewTableName};`,
        );
      }

      await this.runMultipleQueries(queries);
    } catch (error) {
      console.error(`Error updating table '${tableName}':`, error);
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
    }
  }

  private async runMultipleQueries(queries: string[]) {
    for (const query of queries) {
      await this.connection.execute(query);
    }
  }

  private formatConstraint(COLUMN_KEY: string) {
    if (!COLUMN_KEY) return {};
    if (COLUMN_KEY === 'PRI') return { isPrimary: true };
    if (COLUMN_KEY === 'UNI') return { isUnique: true };

    return {};
  }

  private convertToBool(value: string) {
    if (value.toLowerCase() === 'no') return false;
    if (value.toLowerCase() === 'yes') return true;
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
