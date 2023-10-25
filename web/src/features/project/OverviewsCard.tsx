import React, { Fragment, useState } from "react";
import { Navbar } from "./Navbar";
import { TitleCard } from "./TitleCard";

type Props = {
  onMenuClick(): void;
};
export const OverviewsCard = (props: Props) => {
  const { onMenuClick } = props;
  return (
    <Fragment>
      <Navbar title="Overview" onMenuClick={onMenuClick} />

      <main className="max-h-[calc(100vh-50px)] overflow-y-scroll">
        <TitleCard title="Overview" />
      </main>
    </Fragment>
  );
};
