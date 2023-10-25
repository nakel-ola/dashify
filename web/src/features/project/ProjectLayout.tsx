import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

type Props = {
  name: string;
  logo: string | null;
  items: { name: string; icon: string | null }[];
};
export const ProjectLayout = (props: PropsWithChildren<Props>) => {
  const { children, items, logo, name } = props;
  return (
    <div className="grid grid-cols-10 h-screen overflow-hidden page-max-width">
      {/* <Sidebar items={items} logo={logo} name={name} />

      <div className="col-span-8">
        <Navbar />
        {children}
      </div> */}
    </div>
  );
};
