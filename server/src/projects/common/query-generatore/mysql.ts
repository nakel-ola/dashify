import { ModifyOperation } from '../../types/operations.type';
import { selectOrderBy } from '../select-order-by';
import { selectWhere } from '../select-where';
import { stringToFilter } from '../string-to-filter';
import { stringToSort } from '../string-to-sort';

export type DataType = {
  name: string;
  dataType:
    | 'int'
    | 'tinyint'
    | 'smallint'
    | 'mediumint'
    | 'bigint'
    | 'float'
    | 'double'
    | 'decimal'
    | 'date'
    | 'time'
    | 'datetime'
    | 'timestamp'
    | 'year'
    | 'char'
    | 'varchar'
    | 'tinytext'
    | 'text'
    | 'mediumtext'
    | 'longtext'
    | 'enum'
    | 'set'
    | 'binary'
    | 'varbinary'
    | 'tinyblob'
    | 'blob'
    | 'mediumblob'
    | 'longblob'
    | 'geometry'
    | 'point'
    | 'linestring'
    | 'ploygon'
    | 'json';
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

type InsetType = {
  name: string;
  value: string | number;
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

type ForeignKeyType = Pick<DataType, 'references' | 'name'>;

type ContraintNameType = {
  type: 'FOREIGN' | 'PRIMARY';
  tableName: string;
  fieldName: string;
};

type SelectTableArgs = {
  limit?: number;
  offset?: number;
  sort?: string;
  filter?: string;
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

type DeleteFromTableArgs = {
  deleteAll?: boolean;
  where?: {
    name: string;
    value: string;
  };
};

const dataTypes: Record<DataType['dataType'], string> = {
  int: 'INT',
  tinyint: 'TINYINT',
  smallint: 'SMALLINT',
  mediumint: 'MEDIUMINT',
  bigint: 'BIGINT',
  float: 'FLOAT',
  double: 'DOUBLE',
  decimal: 'DECIMAL',
  date: 'DATE',
  time: 'TIME',
  datetime: 'DATETIME',
  timestamp: 'TIMESTAMP',
  year: 'YEAR',
  char: 'CHAR',
  varchar: 'VARCHAR',
  tinytext: 'TINYTEXT',
  text: 'TEXT',
  mediumtext: 'MEDIUMTEXT',
  longtext: 'LONGTEXT',
  enum: 'ENUM',
  set: 'SET',
  binary: 'BINARY',
  varbinary: 'VARBINARY',
  tinyblob: 'TINYBLOB',
  blob: 'BLOB',
  mediumblob: 'MEDIUMBLOB',
  longblob: 'LONGBLOB',
  geometry: 'GEOMETRY',
  point: 'POINT',
  linestring: 'LINESTRING',
  ploygon: 'PLOYGON',
  json: 'JSON',
};

export class MySqlQueryGenerator {
  constructor() {}

  public createTable(tableName: string, items: DataType[]) {
    let results: string[] = [];

    const primaries = items.filter((item) => item.isPrimary === true);
    const foreigns = items.filter((item) => item.references);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const column = this.createColumn(item, primaries.length);

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
        : ['id INT AUTO_INCREMENT PRIMARY KEY'].join(', ')
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
    let query = `SELECT COUNT(*) AS totalCount FROM ${tableName}`;

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
    const column = this.createColumn(item);

    let query = `ALTER TABLE ${tableName}`;

    if (type === 'add') query += ` ADD COLUMN ${column}`;
    if (type === 'drop') query += ` DROP COLUMN ${item.name}`;

    return query;
  }

  public alterModify(tableName: string, item: AlterModifyType) {
    const query = `ALTER TABLE ${tableName}`;

    const results: string[] = [];

    const operations = item.operations.sort(this.customSort);

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];

      if (operation === 'TYPE') {
        results.push(`${query} 
        MODIFY COLUMN ${item.name} TYPE ${dataTypes[item.dataType]};`);
      }

      if (operation === 'ADD DEFAULT') {
        results.push(`${query}
        ALTER COLUMN ${item.name} SET DEFAULT ${item.defaultValue};`);
      }

      if (operation === 'REMOVE DEFAULT') {
        results.push(`${query}
        ALTER COLUMN ${item.name} DROP DEFAULT;`);
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
        const constraintName = 'fk_' + item.references?.collectionName;
        results.push(`${query}
        DROP FOREIGN KEY ${constraintName}`);
      }

      if (operation === 'RENAME') {
        results.push(`${query} 
        CHANGE COLUMN ${item.name} ${item.newName};`);
      }
    }

    return results;
  }

  public insetIntoTable(tableName: string, items: InsetType[]) {
    const columnsName = items.map((item) => item.name);
    const columnsValue = items.map((item) => item.value);
    const query = `INSERT INTO ${tableName} (${columnsName.join(', ')})
    VALUES (${columnsValue.join(', ')})`;

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

  private createColumn(item: DataType, primaries?: number) {
    const dataType = dataTypes[item.dataType];

    let column = `${item.name} ${dataType}`;

    if (item.isIdentify) column += ' AUTO_INCREMENT';

    if (primaries) {
      if (item.isPrimary && primaries === 1) column += ' PRIMARY KEY';
    } else {
      if (item.isPrimary) column += ' PRIMARY KEY';
    }

    if (item.isUnique) column += ' UNIQUE';

    if (item.defaultValue !== null && item.defaultValue !== undefined)
      column += ` DEFAULT ${this.formatDefaultValue(
        item.defaultValue,
        dataType,
      )}`;

    if (!item.isNullable) column += ' NOT NULL';

    return column;
  }

  private formatForeigns(items: DataType[]) {
    const results: string[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const foreign = this.formatForeignKey({
        name: item.name,
        references: item.references,
      });

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
    REFERENCES ${references?.collectionName}(${item.references?.fieldName})
  `;

    if (references?.onUpdate) {
      foreign += `ON UPDATE ${references?.onUpdate.toUpperCase()}\n`;
    }
    if (references?.onDelete) {
      foreign += `    ON DELETE ${references?.onDelete.toUpperCase()}`;
    }

    return foreign;
  }

  private formatDefaultValue(value: string | null, dataType: string) {
    if (value === 'now()') {
      if (dataType === 'DATE') return 'CURRENT_DATE';
      if (dataType === 'TIME') return 'CURRENT_TIME';
      if (dataType === 'TIMESTAMP') return 'CURRENT_TIMESTAMP';
      if (dataType === 'DATETIME') return 'NOW()';
    }

    if (value === '') return `""`;

    if (!isNaN(value as any)) return Number(value);

    return `"${value}"`;
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

  private customSort = (a: string, b: string) => {
    if (a === 'Rename') return 1;
    else if (b === 'Rename') return -1;
    else return a.localeCompare(b);
  };
}
