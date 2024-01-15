import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ColumnType } from "../schema";
import { mySqlDataTypes, postgresqlDatatypes } from "../../../data/datatypes";

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
