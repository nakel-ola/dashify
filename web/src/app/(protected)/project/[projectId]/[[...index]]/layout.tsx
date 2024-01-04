import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { CreateCard } from "./features/create-card";

type Props = {
  params: { projectId: string; index: string[] };
};

export default function ProjectCollectionLayout(
  props: PropsWithChildren<Props>
) {
  const {
    params: { index = [] },
    children,
  } = props;

  if (index.length === 0) return <CreateCard />;
  return children;
}
