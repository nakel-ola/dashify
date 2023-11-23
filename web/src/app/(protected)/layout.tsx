import React, { PropsWithChildren } from "react";
import { CreateCard } from "./dashboard/features/create-card";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <div>
      {children}
      <CreateCard />
    </div>
  );
}
