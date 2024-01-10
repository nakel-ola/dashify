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

type AlterModifyType = {
  operations: (
    | 'Rename'
    | 'Type'
    | 'Add Default'
    | 'Remove Default'
    | 'Add Not null'
    | 'Remove Not null'
    | 'FOREIGN'
  )[];
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

  public alterTable(
    tableName: string,
    type: 'add' | 'modify' | 'drop',
    item: DataType,
  ) {
    const column = this.createColumn(item);

    let query = `ALTER TABLE ${tableName}`;

    if (type === 'add') query += ' ADD COLUMN';
    if (type === 'modify') query += ' MODIFY COLUMN';
    if (type === 'drop') query += ` DROP COLUMN ${item.name}`;

    if (type !== 'drop') query += ` ${column}`;

    return query;
  }

  public alterModify(tableName: string, item: AlterModifyType) {
    const query = `ALTER TABLE ${tableName}`;

    const results: string[] = [];

    for (let i = 0; i < item.operations.length; i++) {
      const operation = item.operations[i];

      if (operation === 'Rename') {
        results.push(`${query} 
        CHANGE COLUMN ${item.name} ${item.newName};`);
      }

      if (operation === 'Type') {
        results.push(`${query} 
        MODIFY COLUMN ${item.name} TYPE ${dataTypes[item.dataType]};`);
      }

      if (operation === 'Add Default') {
        results.push(`${query}
        ALTER COLUMN ${item.name} SET DEFAULT ${item.defaultValue};`);
      }

      if (operation === 'Remove Default') {
        results.push(`${query}
        ALTER COLUMN ${item.name} DROP DEFAULT;`);
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
}
