import React, { useState } from "react";
import { SchemasCard } from "./SchemasCard";
import { Header } from "./Header";

type Props = {
  collections: Collection[];
  onMenuClick(): void;
};

export const SettingsCard = (props: Props) => {
  const { collections, onMenuClick } = props;
  const [active, setActive] = useState(1);

  return (
    <div className="">
      <Header active={active} setActive={setActive} onMenuClick={onMenuClick} />

      <div className="max-h-[calc(100vh-50px)] overflow-y-scroll">
        {active === 1 ? <SchemasCard collections={collections} /> : null}
      </div>
    </div>
  );
};
