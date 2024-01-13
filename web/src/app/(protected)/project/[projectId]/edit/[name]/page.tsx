"use client";

import { useProjectStore } from "../../../store/project-store";

type Props = {
  params: { name: string };
};

export default function ProjectEdit(props: Props) {
  const {
    params: { name },
  } = props;
  const project = useProjectStore((store) => store.project);

  return (
    <div className="flex justify-center py-10">
      <div className="w-[90%] lg:w-[65%] ">
        <h2 className="text-4xl font-semibold leading-none tracking-tight flex items-center">
          Update {project?.database === "mongodb" ? "collection" : "table"}{" "}
          <span className="bg-slate-100 dark:bg-neutral-800 rounded-md px-2 py-1 ml-1 text-sm h-fit">
            {name}
          </span>
        </h2>

        <p className="text-base text-gray-dark dark:text-gray-light pt-2">
          Fill in the details. Click Save when you&apos;re done.
        </p>
      </div>
    </div>
  );
}
