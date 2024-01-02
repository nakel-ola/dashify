"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  limit: "100" | "500" | "1000";
  onLimitChange: (value: "100" | "500" | "1000") => void;
};
export const LimitCard = (props: Props) => {
  const { limit, onLimitChange } = props;

  return (
    <div className="">
      <Select value={limit} onValueChange={onLimitChange as any}>
        <SelectTrigger showIcon={false} className="min-w-[50px] !h-[30px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned" className="w-[200px] h-[110px]">
          <SelectItem value="100">100 rows</SelectItem>
          <SelectItem value="500">500 rows</SelectItem>
          <SelectItem value="1000">1000 rows</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
