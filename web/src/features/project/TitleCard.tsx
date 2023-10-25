import React, { Fragment, useState } from "react";

type Props = {
  title: string;
};
export const TitleCard = (props: Props) => {
  const { title } = props;

  return (
    <Fragment>
      <div className="flex justify-between p-4 mt-3 ">
        <h1 className="text-4xl text-project-text-color dark:text-project-text-color-dark">
          {title}
        </h1>
      </div>
    </Fragment>
  );
};
