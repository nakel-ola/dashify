import type { ModifyOperation } from '../../types/operations.type';
import { selectOrderBy } from '../select-order-by';
import { selectWhere } from '../select-where';
import { stringToFilter } from '../string-to-filter';
import { stringToSort } from '../string-to-sort';

export type DataType = {
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
  time: 'TIME WITHOUT TIME ZONE',
  timetz: 'TIME WITH TIME ZONE',
  timestamp: 'TIMESTAMP WITHOUT TIME ZONE',
  timestamptz: 'TIMESTAMP WITH TIME ZONE',
  bool: 'BOOL',
};

type InsetType = {
  names: string[];
  values: (string | number)[][];
};

type ContraintNameType = {
  type: 'FOREIGN' | 'PRIMARY';
  tableName: string;
  fieldName: string;
};

export type AlterModifyType = {
  operations: ModifyOperation;
  name: string;
  newName?: string;
  dataType?: DataType['dataType'];
  defaultValue?: string | number;
  references?: {
    onUpdate?: 'Cascade' | 'Restrict' | null;
    onDelete?: 'Cascade' | 'Restrict' | 'Set default' | 'Set NULL' | null;
    collectionName: string;
    fieldName: string;
  };
};

type SelectTableArgs = {
  limit?: number;
  offset?: number;
  sort?: string;
  filter?: string;
};

type ForeignKeyType = Pick<DataType, 'references' | 'name'>;

type DeleteFromTableArgs = {
  deleteAll?: boolean;
  where?: {
    name: string;
    value: string;
  };
};

type UpdateTableRowArgs = {
  set: {
    name: string;
    value: string;
  }[];
  where: {
    name: string;
    value: string;
  };
};

export class PostgresQueryGenerator {
  constructor() {}

  public createTable(tableName: string, items: DataType[]) {
    let results: string[] = [];

    const primaries = items.filter((item) => item.isPrimary === true);
    const foreigns = items.filter((item) => item.references);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const column = this.createColumn(item, primaries.length === 1);

      results.push(column);
    }

    if (primaries.length > 1) {
      results.push(
        `PRIMARY KEY (${primaries.map((primary) => primary.name).join(', ')})`,
      );
    }

    if (foreigns.length > 0) {
      results = [...results, ...this.formatForeigns(foreigns)];
    }

    const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${
      results.length > 0
        ? results.join(', ')
        : ['id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY'].join(', ')
    });`;

    return query;
  }

  public selectTable(tableName: string, args: SelectTableArgs) {
    let query = `SELECT * FROM ${tableName}`;

    if (args.limit) query += ` LIMIT ${args.limit}`;
    if (args.offset) query += ` OFFSET ${args.offset}`;

    if (args.filter) {
      const formattedFilter = stringToFilter(args.filter);
      query += ` ${selectWhere(formattedFilter)}`;
    }

    if (args.sort) {
      const formattedSort = stringToSort(args.sort);
      query += ` ${selectOrderBy(formattedSort)}`;
    }

    return query;
  }

  public countTable(
    tableName: string,
    args: Omit<SelectTableArgs, 'limit' | 'offset'>,
  ) {
    let query = `SELECT COUNT(*) FROM ${tableName}`;

    if (args.filter) {
      const formattedFilter = stringToFilter(args.filter);
      query += ` ${selectWhere(formattedFilter)}`;
    }

    if (args.sort) {
      const formattedSort = stringToSort(args.sort);
      query += ` ${selectOrderBy(formattedSort)}`;
    }

    return query;
  }

  public alterTable(tableName: string, type: 'add' | 'drop', item: DataType) {
    const column = this.createColumn(item, true);

    let query = `ALTER TABLE ${tableName}`;

    if (type === 'add') query += ` ADD COLUMN  ${column}`;
    if (type === 'drop') query += ` DROP COLUMN ${item.name}`;

    return query;
  }

  public alterModify(tableName: string, item: AlterModifyType) {
    const query = `ALTER TABLE ${tableName}`;

    const results: string[] = [];

    const operations = item.operations.sort(this.customSort);

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];

      if (operation === 'RENAME') {
        results.push(`${query} 
        RENAME COLUMN ${item.name} TO ${item.newName};`);
      }

      if (operation === 'TYPE') {
        results.push(`${query} 
        ALTER COLUMN ${item.name} TYPE ${dataType[item.dataType]};`);
      }

      if (operation === 'ADD DEFAULT') {
        results.push(`${query}
        ALTER COLUMN ${item.name} SET DEFAULT ${item.defaultValue};`);
      }

      if (operation === 'REMOVE DEFAULT') {
        results.push(`${query}
        ALTER COLUMN ${item.name} DROP DEFAULT;`);
      }

      if (operation === 'ADD NOT NULL') {
        results.push(`${query}
        ALTER COLUMN ${item.name} SET NOT NULL;`);
      }

      if (operation === 'REMOVE NOT NULL') {
        results.push(`${query}
        ALTER COLUMN ${item.name} DROP NOT NULL;`);
      }

      if (operation === 'ADD FOREIGN KEY') {
        const foreign = this.formatForeignKey({
          references: item.references,
          name: item.name,
        });
        results.push(`${query}
        ADD ${foreign}`);
      }

      if (operation === 'REMOVE FOREIGN KEY') {
        const constraintName = this.createContraintName({
          type: 'FOREIGN',
          tableName: item.references.collectionName,
          fieldName: item.references.fieldName,
        });
        results.push(`${query}
        DROP CONSTRAINT ${constraintName}`);
      }
    }

    return results;
  }

  public insertIntoTable(tableName: string, data: InsetType) {
    const columnsName = data.names;

    const columnsValues = data.values.map((value) => `(${value.join(', ')})`);

    const query = `INSERT INTO ${tableName} (${columnsName.join(', ')})
    VALUES ${columnsValues.join(', ')}`;

    return query;
  }

  public updateTableRow(tableName: string, data: UpdateTableRowArgs) {
    let query = `UPDATE ${tableName}`;

    const set = data.set
      .map((value) => `${value.name} = ${value.value}`)
      .join(', ');

    query += ` SET ${set}`;

    const where = selectWhere([{ ...data.where, operator: '=' }]);

    query += ` ${where}`;

    return query;
  }

  public deleteFromTable(tableName: string, data: DeleteFromTableArgs) {
    let query = `DELETE FROM ${tableName}`;

    if (!data.deleteAll && data.where) {
      const where = selectWhere([{ ...data.where, operator: '=' }]);
      query += ` ${where}`;
    }

    return query;
  }

  public dropTable(tableName: string) {
    return `DROP TABLE IF EXISTS ${tableName};`;
  }

  private createColumn(item: DataType, singlePrimary: boolean) {
    let column = `${item.name} ${dataType[item.dataType]}`;

    if (item.isArray) column += '[]';

    if (item.isIdentify) column += ' GENERATED BY DEFAULT AS IDENTITY';

    if (item.isPrimary && singlePrimary) column += ' PRIMARY KEY';

    if (item.isUnique) column += ' UNIQUE';

    if (!item.isNullable) column += ' NOT NULL';

    if (item.defaultValue !== null && item.defaultValue !== undefined)
      column += ` DEFAULT ${this.formatDefaultValue(item.defaultValue)}`;

    return column;
  }

  private formatDefaultValue(value: string | null) {
    if (value === 'now()') return 'now()';
    if (value === "(now() at time zone 'utc)")
      return "(now() AT TIME ZONE 'UTC'::text)";
    if (value === 'gen_random_uuid()') return 'gen_random_uuid()';

    if (value === '') return `""`;

    if (!isNaN(value as any)) return Number(value);

    return `"${value}"`;
  }

  private formatForeigns(items: DataType[]) {
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
  }

  private formatForeignKey(item: ForeignKeyType) {
    const references = item.references;

    const constraintName = this.createContraintName({
      type: 'FOREIGN',
      tableName: references.collectionName,
      fieldName: references.fieldName,
    });
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

    return foreign;
  }

  private createContraintName(item: ContraintNameType) {
    let name = '';

    if (item.type === 'FOREIGN') name += 'fk';

    if (item.tableName) name += `_${item.tableName}`;

    if (item.fieldName && item.type !== 'PRIMARY') name += `_${item.fieldName}`;

    if (item.type === 'PRIMARY') name += '_pkey';
    else name += '_key';

    return name;
  }

  private customSort = (
    a: ModifyOperation[number],
    b: ModifyOperation[number],
  ) => {
    if (a === 'RENAME') return 1;
    else if (b === 'RENAME') return -1;
    else return a.localeCompare(b);
  };
}
