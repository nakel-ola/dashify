import React, { PropsWithChildren } from "react";
import { TitleCard } from "../../features";
import { TabsCard } from "./features";

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <>
      <TitleCard title="Settings" bottomCard={<TabsCard />} />

      {children}
    </>
  );
}
