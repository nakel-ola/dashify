import { Client, QueryResult } from 'pg';
import { getDataTypeGroup } from './utils';
import { Collection } from '../types/project.type';
import {
  PostgresQueryGenerator,
  type DataType,
  AlterModifyType,
} from './query-generatore/postgres';
import { v4 } from 'uuid';
import { InternalServerErrorException } from '@nestjs/common';

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
  deleteAll?: boolean;
  where?: {
    name: string;
    value: string;
  };
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

export class CockroachDatabase {
  private client: Client;
  private queryGen = new PostgresQueryGenerator();

  constructor(connectionOption: ConnectionOption) {
    this.connect(connectionOption);
  }

  private async connect(connectionOption: ConnectionOption) {
    const { host, name, username, port, password } = connectionOption;
    try {
      this.client = new Client({
        user: username,
        host,
        database: name,
        password,
        port,
        ssl: true,
      });

      this.client.connect();
    } catch (error) {
      console.error('Error connecting to Cockroach database:', error);

      throw new InternalServerErrorException(error.message);
    }
  }

  public async createTable(
    tableName: string,
    columns: DataType[],
  ): Promise<QueryResult> {
    try {
      const queryGen = new PostgresQueryGenerator();
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const tableQuery = queryGen.createTable(escapeTableName, columns);

      const result = await this.client.query(tableQuery);
      return result;
    } catch (error) {
      console.error(`Error creating table "${tableName}":`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async getTables() {
    try {
      const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'  -- Assuming you're using the public schema
        AND table_type = 'BASE TABLE';
     `;

      const results: Collection[] = [];

      const tableResult = await this.client.query(query);
      const tables = tableResult.rows.map((row) => row.table_name);

      for (const tableName of tables) {
        const schemaQuery = `
          SELECT column_name, data_type, udt_name, column_default, is_nullable, is_identity
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = $1;
        `;

        const columnKeyQuery = `
          SELECT ku.column_name, tc.constraint_type
          FROM information_schema.key_column_usage ku
          JOIN information_schema.table_constraints tc
            ON ku.table_name = tc.table_name
            AND ku.constraint_name = tc.constraint_name
          WHERE ku.table_name = $1;
        `;

        const schemaResult = await this.client.query<ColumnInfo>(schemaQuery, [
          tableName,
        ]);
        const columnKeyResult = await this.client.query<ColumnConstraintInfo>(
          columnKeyQuery,
          [tableName],
        );

        const tableSchema = schemaResult.rows;

        const tables = tableSchema.map((row) => {
          const dataType = row.data_type;

          const udtName = row.udt_name;

          const constraint = columnKeyResult.rows.find(
            (r) => r.column_name === row.column_name,
          );

          const isArray = dataType === 'ARRAY';

          return {
            id: v4(),
            name: row.column_name,
            type: getDataTypeGroup(dataType),
            dataType: isArray ? udtName.slice(1) : dataType,
            udtName,
            defaultValue: row.column_default,
            isNullable: this.convertToBool(row.is_nullable),
            isIdentify: this.convertToBool(row.is_identity),
            isArray,
            isPrimary: false,
            isUnique: false,
            ...this.formatConstraint(constraint),
          };
        });

        results.push({ name: tableName, icon: 'Settings', fields: tables });
      }

      return results;
    } catch (error) {
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
        sort,
        filter,
      });

      const schemaResult = await this.client.query(schemaQuery);
      const totalItems = await this.client.query(countQuery);

      return {
        results: schemaResult.rows,
        totalItems: totalItems.rows[0].count,
      };
    } catch (error) {
      console.error(`Error getting table '${tableName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async insertRow(args: InsertRowArgs) {
    const { tableName, data } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const query = this.queryGen.insertIntoTable(escapeTableName, data);

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

  public async deleteRow(args: DeleteRowArgs) {
    const { tableName, deleteAll, where } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const query = this.queryGen.deleteFromTable(escapeTableName, {
        deleteAll,
        where,
      });

      await this.client.query(query);
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
    } catch (error) {
      console.error(`Error updating table '${tableName}':`, error);
      throw new InternalServerErrorException(error.message);
    }
  }

  public async duplicateTable(args: DuplicateTableArgs): Promise<QueryResult> {
    const { tableName, duplicateName } = args;

    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);
      const escapeNewTableName = this.client.escapeIdentifier(duplicateName);

      const query = `CREATE TABLE IF NOT EXISTS ${escapeNewTableName} AS TABLE ${escapeTableName} WITH NO DATA;`;

      const result = await this.client.query(query);
      return result;
    } catch (error) {
      console.error(
        `Error duplicating table '${tableName}' to '${duplicateName}':`,
        error,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  public async deleteTable(tableName: string): Promise<QueryResult> {
    try {
      const escapeTableName = this.client.escapeIdentifier(tableName);

      const query = `DROP TABLE IF EXISTS ${escapeTableName};`;
      const result = await this.client.query(query);
      return result;
    } catch (error) {
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

  public async close(): Promise<void> {
    try {
      await this.client.end();
      console.log('Connection to CockroachDB database closed');
    } catch (error) {
      console.error('Error closing connection to CockroachDB database:', error);
    }
  }
}
