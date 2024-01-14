import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ColumnType } from "../schema";

type Props = {
  dataType: string;
  database: Projects["database"];
  updateColumn: <T extends keyof ColumnType>(
    key: T,
    value: ColumnType[T]
  ) => void;
};
export const DataTypeSelectCard = (props: Props) => {
  const { updateColumn, dataType, database } = props;

  const datatypes = database === "mysql" ? mySqlDataTypes : postgresqlDatatypes;
  return (
    <Select
      value={dataType}
      onValueChange={(value) => updateColumn("dataType", value)}
    >
      <SelectTrigger className="w-full min-w-[120px] lg:w-full !h-[38px]">
        <SelectValue defaultValue="" placeholder="---" className="" />
      </SelectTrigger>

      <SelectContent className="max-h-52 overflow-y-scroll">
        {datatypes.map((name, index) => (
          <SelectItem key={index} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const postgresqlDatatypes = [
  "int2",
  "int4",
  "int8",
  "float4",
  "float8",
  "numeric",
  "json",
  "jsonb",
  "text",
  "varchar",
  "uuid",
  "date",
  "time",
  "timetz",
  "timestamp",
  "timestamptz",
  "bool",
];

const mySqlDataTypes = [
  "int",
  "tinyint",
  "smallint",
  "mediumint",
  "bigint",
  "float",
  "double",
  "decimal",
  "date",
  "time",
  "datetime",
  "timestamp",
  "year",
  "char",
  "varchar",
  "tinytext",
  "text",
  "mediumtext",
  "longtext",
  "enum",
  "set",
  "binary",
  "varbinary",
  "tinyblob",
  "blob",
  "mediumblob",
  "longblob",
  "geometry",
  "point",
  "linestring",
  "ploygon",
  "json",
];
