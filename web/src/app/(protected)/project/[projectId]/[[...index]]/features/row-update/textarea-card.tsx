import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = TextareaProps & {
  setNull?: () => void;
  isNullable?: boolean;
};
export const TextareaCard = (props: Props) => {
  const { onChange, className, setNull, isNullable, ...rest } = props;
  return (
    <div className="relative w-full">
      <Textarea
        rows={5}
        className={cn("relative", className)}
        {...rest}
        onChange={onChange}
      />

      {isNullable ? (
        <button
          type="button"
          onClick={setNull}
          className="border border-slate-200 dark:border-neutral-700 rounded-md absolute top-2 right-2 bg-slate-100 dark:bg-neutral-800 text-xs px-2 py-1 transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          Set to NULL
        </button>
      ) : null}
    </div>
  );
};
