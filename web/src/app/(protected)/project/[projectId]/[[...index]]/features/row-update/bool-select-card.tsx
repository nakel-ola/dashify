import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: boolean | null;
  onChange?: (value: boolean | null) => void;
  disabled?: boolean;
};
export const BoolSelectCard = (props: Props) => {
  const { value = null, onChange, disabled } = props;
  return (
    <Select
      value={JSON.stringify(value)}
      onValueChange={(newValue) => onChange?.(JSON.parse(newValue))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="---" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="true">TRUE</SelectItem>
        <SelectItem value="false">FALSE</SelectItem>
        <SelectItem value="null">NULL</SelectItem>
      </SelectContent>
    </Select>
  );
};
