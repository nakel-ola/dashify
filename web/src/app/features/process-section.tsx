import React from "react";

export const ProcessSection = () => {
  const items = [
    {
      title: "Connect Database",
      description:
        "Create a new dash by selecting a database and adding database credentials.",
    },
    {
      title: "Customize",
      description: "Customize your dash, change color, add charts",
    },
    {
      title: "Success",
      description: "Add your employees to dash and enjoy.",
    },
  ];
  return (
    <div className="grid place-items-center w-full mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Process
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-dark-text dark:text-white sm:text-4xl">
          How it works
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 min-w-max gap-10 mt-10 ">
        {items.map((item, index) => (
          <Card key={index} index={index + 1} {...item} />
        ))}
      </div>
    </div>
  );
};

type CardProps = {
  title: string;
  description: string;
  index: number;
};

const Card = (props: CardProps) => {
  const { description, index, title } = props;
  return (
    <div className="flex items-center justify-center flex-col max-w-xs">
      <span className="h-[30px] w-[30px] flex items-center justify-center rounded-full bg-black dark:bg-white">
        <p className="text-white dark:text-black font-medium">{index}</p>
      </span>

      <h1 className="text-xl font-medium py-1 text-black dark:text-white">
        {title}
      </h1>

      <p className="text-center text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
};
