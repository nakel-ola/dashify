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
  updateColumn: <T extends keyof ColumnType>(
    key: T,
    value: ColumnType[T]
  ) => void;
};
export const DataTypeSelectCard = (props: Props) => {
  const { updateColumn, dataType } = props;
  return (
    <Select
      value={dataType}
      onValueChange={(value) => updateColumn("dataType", value)}
    >
      <SelectTrigger className="w-full lg:w-[120px] !h-[38px]">
        <SelectValue defaultValue="" placeholder="---" className="" />
      </SelectTrigger>

      <SelectContent className="max-h-52 overflow-y-scroll">
        {datatypes.map(({ name }, index) => (
          <SelectItem key={index} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const datatypes = [
  {
    name: "int2",
  },
  {
    name: "int4",
  },
  {
    name: "int8",
  },
  {
    name: "float4",
  },
  {
    name: "float8",
  },
  {
    name: "numeric",
  },
  {
    name: "json",
  },
  {
    name: "jsonb",
  },
  {
    name: "text",
  },
  {
    name: "varchar",
  },
  {
    name: "uuid",
  },
  {
    name: "date",
  },
  {
    name: "time",
  },
  {
    name: "timetz",
  },
  {
    name: "timestamp",
  },
  {
    name: "timestamptz",
  },
  {
    name: "bool",
  },
];
