import { cx } from "class-variance-authority";

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cx("mx-auto max-w-[120rem] px-8", className)}>
      {children}
    </div>
  );
};
