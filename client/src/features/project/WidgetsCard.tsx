import React, { Fragment } from "react";

type Props = {};
export const WidgetsCard = (props: Props) => {
  return (
    <Fragment>
      <div className="flex flex-col items-center">
        <h2 className="font-sans text-4xl text-black dark:text-white font-semibold">
          Drag new widget
        </h2>
        <p className="text-gray-dark dark:text-gray-light text-center my-5">
          Boost your data awareness with widgets. <br /> Just hold and drag!
        </p>
      </div>
    </Fragment>
  );
};
