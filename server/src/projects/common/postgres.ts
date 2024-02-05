import { Client, QueryResult } from 'pg';
import { Collection, Fields } from '../types/project.type';
import { getDataTypeGroup } from './utils';
import {
  PostgresQueryGenerator,
  type DataType,
  type AlterModifyType,
} from './query-generatore/postgres';
import { v4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

interface ConnectionOption {
  name: string;
  host: string;
  ssl: boolean;
  port: number;
  username: string;
  password: string;
}

type TableInfo = {
  schema: string;
  table_name: string;
};

type ColumnInfo = {
  column_name: string;
  data_type: string;
  udt_name: string;
  column_default: string;
  is_nullable: string;
  is_identity: string;
};
type ColumnConstraintInfo = {
  column_name: string;
  constraint_type: string;
};

type GetTableArgs = {
  tableName: string;
  offset: number;
  limit: number;
  filter?: string;
  sort?: string;
};

type InsertRowArgs = {
  tableName: string;
  data: {
    name: string;
    value: string | number;
  }[];
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

type EditTableArgs = {
  tableName: string;
  newTableName?: string;
  columns?: (EditModifyTable | EditColumnTable)[];
};

type DuplicateTableArgs = {
  tableName: string;
  duplicateName: string;
  withData?: boolean;
};

export class PostgresDatabase {
  private client: Client;
  private queryGen = new PostgresQueryGenerator();

  constructor(connectionOption: ConnectionOption) {
    const { host, name, username, port, password } = connectionOption;

    const databaseUrl = `postgres://${username}:${password}@${host}:${port}/${name}`;

    this.client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    this.connect();
  }

  private async connect() {
    try {
      await this.client.connect();
    } catch (error: any) {
      console.error('Error connecting to PostgreSQL database:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async createTable(tableName: string, columns: DataType[]) {
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const tableQuery = this.queryGen.createTable(escapeTableName, columns);

      const result = await this.client.query(tableQuery);
      return result;
    } catch (error: any) {
      console.error(`Error creating table "${tableName}":`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getTables() {
    try {
      const results: Collection[] = [];

      const tableQuery = `
        SELECT table_schema AS schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE' 
        AND table_schema = 'public';
      `;

      const tableResult = await this.client.query<TableInfo>(tableQuery);
      const tables = tableResult.rows.map((row) => row.table_name);

      for (const tableName of tables) {
        const columnQuery = `
          SELECT column_name, data_type, udt_name, column_default, is_nullable, is_identity
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
        `;
        const columnKeyQuery = `
          SELECT ku.column_name, tc.constraint_type
          FROM information_schema.key_column_usage ku
          JOIN information_schema.table_constraints tc
            ON ku.table_name = tc.table_name
            AND ku.constraint_name = tc.constraint_name
          WHERE ku.table_name = $1;
        `;

        const columnResult = await this.client.query<ColumnInfo>(columnQuery, [
          tableName,
        ]);
        const columnKeyResult = await this.client.query<ColumnConstraintInfo>(
          columnKeyQuery,
          [tableName],
        );

        const fields: Fields[] = [];

        for (const columnInfo of columnResult.rows) {
          const dataType = columnInfo.data_type;

          const constraint = columnKeyResult.rows.find(
            (row) => row.column_name === columnInfo.column_name,
          );

          const isArray = dataType === 'ARRAY';

          const udtName = columnInfo.udt_name;

          fields.push({
            id: v4(),
            name: columnInfo.column_name,
            type: getDataTypeGroup(dataType),
            dataType: isArray ? udtName.slice(1) : dataType,
            udtName: isArray ? udtName.slice(1) : udtName,
            defaultValue: columnInfo.column_default,
            isNullable: this.convertToBool(columnInfo.is_nullable),
            isIdentify: this.convertToBool(columnInfo.is_identity),
            isArray,
            isPrimary: false,
            isUnique: false,
            ...this.formatConstraint(constraint),
          });
        }

        results.push({ name: tableName, icon: 'Settings', fields });
      }

      return results;
    } catch (error: any) {
      console.error(`Error getting tables:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getTable(args: GetTableArgs) {
    const { tableName, limit, offset, sort, filter } = args;
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const schemaQuery = this.queryGen.selectTable(escapeTableName, {
        limit,
        offset,
        sort,
        filter,
      });

      const countQuery = this.queryGen.countTable(escapeTableName, {
        filter,
      });

      const schemaResult = await this.client.query(schemaQuery);

      const totalItems = await this.client.query(countQuery);

      return {
        results: schemaResult.rows,
        totalItems: totalItems.rows[0].count,
      };
    } catch (error: any) {
      console.error(`Error getting table '${tableName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async insertRow(args: InsertRowArgs) {
    const { tableName, data } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const query = this.queryGen.insertIntoTable(escapeTableName, data);

      console.log(query);

      await this.client.query(query);

      return { message: 'Row inserted successfully' };
    } catch (error) {
      console.error(`Error creating row:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async updateRow(args: UpdateRowArgs) {
    const { tableName, set, where } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const query = this.queryGen.updateTableRow(escapeTableName, {
        set,
        where,
      });

      await this.client.query(query);

      return { message: 'Row updated successfully' };
    } catch (error) {
      console.error(`Error updating row:`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteRows(args: DeleteRowArgs) {
    const { tableName, deleteAll, where = [] } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

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
      const escapeTableName = this.client.escapeIdentifier(tableName);

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
        const escapeNewTableName = this.client.escapeIdentifier(newTableName);

        queries.push(
          `ALTER TABLE ${escapeTableName} RENAME TO ${escapeNewTableName};`,
        );
      }

      const results = await this.runMultipleQueries(queries);

      return results;
    } catch (error: any) {
      console.error(`Error updating table '${tableName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async duplicateTable(args: DuplicateTableArgs) {
    const { tableName, duplicateName } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const escapeNewTableName = this.client.escapeIdentifier(duplicateName);
      const query = `CREATE TABLE IF NOT EXISTS ${escapeNewTableName} AS TABLE ${escapeTableName} WITH NO DATA;`;

      const result = await this.client.query(query);
      return result;
    } catch (error: any) {
      console.error(
        `Error duplicating table '${tableName}' to '${duplicateName}':`,
        error,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteTable(tableName: string) {
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const query = `DROP TABLE IF EXISTS ${escapeTableName};`;
      const result = await this.client.query(query);
      return result;
    } catch (error: any) {
      console.error(`Error deleting table "${tableName}":`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  private async runMultipleQueries(queries: string[]) {
    const results: QueryResult<any>[] = [];
    for (const query of queries) {
      const result = await this.client.query(query);

      results.push(result);
    }

    return results;
  }

  private formatConstraint(contraint: ColumnConstraintInfo) {
    if (!contraint) return {};
    if (contraint.constraint_type === 'PRIMARY KEY') return { isPrimary: true };
    if (contraint.constraint_type === 'UNIQUE') return { isUnique: true };

    return {};
  }

  private convertToBool(value: string) {
    if (value.toLowerCase() === 'no') return false;
    if (value.toLowerCase() === 'yes') return true;
  }

  public async close() {
    try {
      await this.client.end();
      console.log('Connection to PostgreSQL database closed');
    } catch (error) {
      console.error('Error closing connection to PostgreSQL database:', error);
    }
  }
}
