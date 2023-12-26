import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { RippleCard } from "@/components/ripple-card";
import { ChevronDown } from "lucide-react";

type HeadType = {
  name: string;
  className?: string;
};

type DataType = {
  name?: string;
  className?: string;
  children?: ReactNode;
  type: "head" | "content";
  onClick?: () => {};
};

type Props = {
  head: HeadType[];
  data: DataType[][];
};

export const TableCard = (props: Props) => {
  const { head, data } = props;

  return (
    <div className="mt-10">
      <div className="hidden md:block rounded-md border-[1.5px] border-slate-100 dark:border-neutral-800 ">
        <Table>
          <TableHeader>
            <TableRow>
              {head.map((value) => (
                <TableHead key={value.name} className={value.className}>
                  {value.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length ? (
              data.map((items, index) => (
                <TableRow key={index}>
                  {items.map(({ children, className }, i) => (
                    <TableCell key={i} className={className}>
                      {children}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="block md:hidden space-y-5">
        {data.length ? (
          data.map((value, index) => (
            <CollapsibleCard key={index} items={value} />
          ))
        ) : (
          <div className="h-10 text-center">
            <p className="">No results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

type CollapsibleCardProps = {
  items: DataType[];
};

const CollapsibleCard = (props: CollapsibleCardProps) => {
  const { items } = props;
  const [isOpen, setIsOpen] = useState(false);

  const header = items.find((d) => d.type === "head");
  const contents = items.filter((d) => d.type === "content");
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 ">
        <div className="">{header?.children}</div>
        <CollapsibleTrigger asChild>
          <RippleCard
            Component="button"
            className="w-[35px] h-[35px] text-black dark:text-white bg-slate-100/50 dark:bg-slate-100/10 flex items-center justify-center transition-transform rounded-full shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </RippleCard>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex items-center justify-between w-full !mt-5">
        {contents.map((content, index) => (
          <div key={index}>
            <p className="font-medium text-slate-500 dark:text-slate-400">
              {content.name}
            </p>

            {content.children}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const formatData = (head: Props["head"], data: Props["data"]) => {
  return head.map((value, index) => ({
    head: value,
    data: data[index],
  }));
};
